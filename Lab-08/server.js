const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const slugify = require('slugify');

const labs = require('./labs');
const { logger, LOG_FILE } = require('./modules/logger');

const PORT = process.env.PORT || 3000;
const SCREENSHOTS_DIR = path.join(__dirname, 'public', 'screenshots');

// Ensure screenshots directory exists
try {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
} catch (err) {
    console.error('Failed to create screenshots dir:', err.message);
}

/*
|--------------------------------------------------------------------------
| HELPER: resolveLabFile
|--------------------------------------------------------------------------
| Resolves lab relative path case-insensitively on Linux / Render
*/
function resolveLabFile(relPath) {
    const direct = path.resolve(__dirname, relPath);
    if (fs.existsSync(direct)) return direct;

    const baseDir = path.dirname(direct);
    const fileName = path.basename(direct);
    const parentDir = path.dirname(baseDir);
    const folderName = path.basename(baseDir);

    if (fs.existsSync(parentDir)) {
        try {
            const entries = fs.readdirSync(parentDir);
            const matchFolder = entries.find(e => e.toLowerCase() === folderName.toLowerCase());
            if (matchFolder) {
                const actualFolder = path.join(parentDir, matchFolder);
                const files = fs.readdirSync(actualFolder);
                const matchFile = files.find(f => f.toLowerCase() === fileName.toLowerCase());
                if (matchFile) {
                    return path.join(actualFolder, matchFile);
                }
            }
        } catch (e) {}
    }
    return direct;
}

/*
|--------------------------------------------------------------------------
| HELPER: send(res, status, data, contentType)
|--------------------------------------------------------------------------
| Uniform response helper used across all routes
*/
function send(res, status, data, contentType = null) {
    if (typeof data === 'object') {
        const body = JSON.stringify(data, null, 2);
        res.writeHead(status, {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(body)
        });
        res.end(body);
    } else {
        res.writeHead(status, {
            'Content-Type': contentType || 'text/html; charset=utf-8',
            'Content-Length': Buffer.byteLength(data)
        });
        res.end(data);
    }
}

/*
|--------------------------------------------------------------------------
| HELPER: escapeHtml
|--------------------------------------------------------------------------
| Escapes <, >, &, ", ' before rendering code in HTML
*/
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/*
|--------------------------------------------------------------------------
| CSS STYLESHEET (Node.js Brand Palette, Clean White, Bento Layout)
|--------------------------------------------------------------------------
*/
const sharedStyles = `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #FFFFFF;
      --card-bg: #FFFFFF;
      --card-border: #E2E8F0;
      --card-hover-border: #CBD5E1;
      
      /* Official Node.js Brand Colors */
      --node-green: #339933;
      --node-green-light: #5FA04E;
      --node-dark: #215732;
      --node-mint: #10B981;
      --node-mint-bg: #ECFDF5;
      --node-mint-border: #A7F3D0;
      
      /* Neutrals & Slate */
      --text-main: #0F172A;
      --text-body: #334155;
      --text-muted: #64748B;
      --slate-subtle: #F8FAFC;
      --code-bg: #0F172A;
      --terminal-bar: #1E293B;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg);
      background-image: radial-gradient(#CBD5E1 0.75px, transparent 0.75px);
      background-size: 20px 20px;
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.6;
      padding-bottom: 70px;
    }

    .container { max-width: 1240px; margin: 0 auto; padding: 0 24px; }

    /* 1. NAVBAR */
    .navbar {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--card-border);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 14px 0;
      margin-bottom: 32px;
    }
    .navbar-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--text-main);
    }
    .brand-logo-hex {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #E8F5E9;
      border: 1px solid #C8E6C9;
      border-radius: 10px;
      color: var(--node-green);
      transition: transform 0.2s ease;
    }
    .brand-link:hover .brand-logo-hex {
      transform: scale(1.05) rotate(4deg);
    }
    .brand-title {
      font-size: 1.18rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.3px;
    }
    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
      display: block;
    }
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .student-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: var(--slate-subtle);
      border: 1px solid var(--card-border);
      border-radius: 9999px;
      font-size: 0.8rem;
      color: var(--text-body);
      font-weight: 500;
    }
    .student-chip strong {
      color: var(--text-main);
      font-weight: 700;
    }
    .env-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--node-mint-bg);
      border: 1px solid var(--node-mint-border);
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--node-dark);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--node-mint);
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulseGreen 2s infinite;
    }
    @keyframes pulseGreen {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    /* 2. METRIC / TELEMETRY BAR (BENTO ROW) */
    .telemetry-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    @media (max-width: 960px) {
      .telemetry-row { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 540px) {
      .telemetry-row { grid-template-columns: 1fr; }
    }
    .bento-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.04);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      transition: all 0.25s ease;
    }
    .bento-card:hover {
      border-color: var(--node-green);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px -4px rgba(51, 153, 51, 0.12);
    }
    .bento-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .bento-title {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
    }
    .bento-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    .icon-green { background: #E8F5E9; color: var(--node-green); }
    .icon-mint { background: var(--node-mint-bg); color: var(--node-mint); }
    .icon-forest { background: #F1F8E9; color: var(--node-dark); }
    .icon-slate { background: #F1F5F9; color: var(--text-body); }
    .bento-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-main);
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: -1px;
    }
    .bento-subtext {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* 3. QUICK ENDPOINT PILLS */
    .endpoints-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 36px;
      padding: 12px 18px;
      background: #FFFFFF;
      border: 1px solid var(--card-border);
      border-radius: 14px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
    }
    .endpoints-label {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-right: 4px;
      letter-spacing: 0.5px;
    }
    .endpoint-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--slate-subtle);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--text-main);
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .endpoint-pill:hover {
      background: #E8F5E9;
      border-color: #A5D6A7;
      color: var(--node-dark);
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(51, 153, 51, 0.15);
    }
    .method-get {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--node-green);
    }

    /* 4. HERO SECTION */
    .hero-section {
      background: #FFFFFF;
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 44px;
      margin-bottom: 44px;
      box-shadow: 0 6px 24px -4px rgba(15, 23, 42, 0.04);
      display: grid;
      grid-template-columns: 1.25fr 1fr;
      gap: 36px;
      align-items: center;
    }
    @media (max-width: 960px) {
      .hero-section { grid-template-columns: 1fr; padding: 32px 24px; gap: 28px; }
    }
    .hero-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: #E8F5E9;
      border: 1px solid #C8E6C9;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--node-dark);
      margin-bottom: 16px;
    }
    .hero-title {
      font-size: 2.35rem;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.22;
      letter-spacing: -0.6px;
      margin-bottom: 16px;
    }
    .node-gradient {
      background: linear-gradient(135deg, var(--node-green) 0%, var(--node-green-light) 50%, var(--node-dark) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-desc {
      font-size: 1.02rem;
      color: var(--text-body);
      line-height: 1.65;
      margin-bottom: 24px;
    }
    .hero-cta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 22px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }
    .btn-node {
      background: var(--node-green);
      color: #FFFFFF;
      box-shadow: 0 4px 12px rgba(51, 153, 51, 0.25);
    }
    .btn-node:hover {
      background: #2b802b;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(51, 153, 51, 0.35);
    }
    .btn-outline {
      background: #FFFFFF;
      color: var(--text-body);
      border: 1px solid var(--card-border);
    }
    .btn-outline:hover {
      background: var(--slate-subtle);
      border-color: var(--card-hover-border);
      color: var(--text-main);
      transform: translateY(-2px);
    }
    .btn-secondary {
      background: var(--slate-subtle);
      color: var(--text-body);
      border: 1px solid var(--card-border);
    }
    .btn-secondary:hover {
      background: #E2E8F0;
      color: var(--text-main);
    }
    .hero-checklist {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      font-size: 0.84rem;
      font-weight: 600;
      color: var(--text-body);
    }
    .checklist-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .check-icon {
      color: var(--node-green);
      font-weight: 800;
    }

    /* Terminal Window Card */
    .terminal-window {
      background: var(--code-bg);
      border: 1px solid #334155;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 16px 36px -6px rgba(15, 23, 42, 0.3);
    }
    .terminal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      background: var(--terminal-bar);
      border-bottom: 1px solid #334155;
    }
    .mac-lights {
      display: flex;
      gap: 7px;
    }
    .mac-light {
      width: 11px;
      height: 11px;
      border-radius: 50%;
    }
    .light-red { background: #EF4444; }
    .light-yellow { background: #F59E0B; }
    .light-green { background: #10B981; }
    .terminal-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      color: #94A3B8;
      font-weight: 500;
    }
    .terminal-body {
      padding: 22px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      color: #E2E8F0;
      line-height: 1.7;
    }
    .code-pipeline {
      background: #020617;
      border: 1px solid #1E293B;
      border-radius: 10px;
      padding: 14px 16px;
      margin-top: 14px;
    }
    .terminal-chips {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 16px;
    }
    .terminal-chip {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 8px 12px;
    }
    .chip-label { font-size: 0.7rem; color: #94A3B8; text-transform: uppercase; }
    .chip-value { font-size: 0.88rem; font-weight: 700; color: #F8FAFC; margin-top: 2px; }

    /* 5. LAB DIRECTORY GRID */
    .section-header {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 1.45rem;
      font-weight: 800;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-desc {
      font-size: 0.92rem;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .category-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 36px 0 20px;
    }
    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .cat-server {
      background: #E8F5E9;
      color: var(--node-dark);
      border: 1px solid #C8E6C9;
    }
    .cat-script {
      background: #FFFBEB;
      color: #92400E;
      border: 1px solid #FDE68A;
    }
    .cat-line {
      flex: 1;
      height: 1px;
      background: var(--card-border);
    }
    .labs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
    }
    .lab-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 4px 10px -2px rgba(15, 23, 42, 0.03);
      transition: all 0.25s ease;
      position: relative;
    }
    .lab-card:hover {
      border-color: var(--card-hover-border);
      transform: translateY(-4px);
      box-shadow: 0 16px 28px -6px rgba(15, 23, 42, 0.08);
    }
    .lab-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .lab-id-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--node-dark);
      background: #E8F5E9;
      border: 1px solid #C8E6C9;
      padding: 4px 10px;
      border-radius: 6px;
    }
    .lab-type-tag {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .tag-server {
      background: var(--node-mint-bg);
      color: var(--node-dark);
      border: 1px solid var(--node-mint-border);
    }
    .tag-script {
      background: #FFFBEB;
      color: #B45309;
      border: 1px solid #FDE68A;
    }
    .lab-card-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 6px;
    }
    .lab-route-badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.76rem;
      color: #0284C7;
      background: #F0F9FF;
      border: 1px solid #BAE6FD;
      padding: 3px 8px;
      border-radius: 6px;
      margin-bottom: 12px;
      word-break: break-all;
    }
    .lab-card-desc {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-bottom: 20px;
    }
    .lab-card-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn-inspect {
      background: var(--slate-subtle);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      font-size: 0.82rem;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-inspect:hover {
      background: #E2E8F0;
    }
    .btn-live-act {
      background: var(--node-mint-bg);
      border: 1px solid var(--node-mint-border);
      color: var(--node-dark);
      font-size: 0.82rem;
      font-weight: 700;
      padding: 8px 14px;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-live-act:hover {
      background: #D1FAE5;
      transform: translateY(-2px);
    }
    .btn-run-act {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      color: #B45309;
      font-size: 0.82rem;
      font-weight: 700;
      padding: 8px 14px;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-run-act:hover {
      background: #FEF3C7;
      transform: translateY(-2px);
    }

    /* 6. SLIDE-OVER DRAWER / MODAL FOR JSON ENDPOINTS */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-card {
      background: #FFFFFF;
      border: 1px solid var(--card-border);
      border-radius: 20px;
      max-width: 680px;
      width: 100%;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.25);
      animation: modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    @keyframes modalPop {
      0% { opacity: 0; transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }
    .modal-header {
      padding: 18px 24px;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--slate-subtle);
    }
    .modal-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .modal-endpoint-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .modal-badge-status {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--node-mint-bg);
      color: var(--node-dark);
      border: 1px solid var(--node-mint-border);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
    }
    .modal-badge-latency {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      color: var(--text-muted);
    }
    .modal-close-btn {
      background: none;
      border: none;
      font-size: 1.4rem;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .modal-close-btn:hover { background: #E2E8F0; color: var(--text-main); }
    .modal-body {
      padding: 20px 24px;
      overflow-y: auto;
      background: var(--code-bg);
    }
    .modal-pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: #38BDF8;
      white-space: pre-wrap;
      line-height: 1.6;
    }
    .modal-footer {
      padding: 14px 24px;
      border-top: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--slate-subtle);
    }

    /* Lab Detail View specific styles */
    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .breadcrumbs a { color: var(--node-green); text-decoration: none; font-weight: 600; }
    .breadcrumbs a:hover { text-decoration: underline; }
    .detail-card {
      background: #FFFFFF;
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 32px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
    }
    .code-viewer {
      background: var(--code-bg);
      border: 1px solid #334155;
      border-radius: 12px;
      overflow: hidden;
      margin-top: 16px;
      margin-bottom: 32px;
      box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.2);
    }
    .code-viewer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 18px;
      background: var(--terminal-bar);
      border-bottom: 1px solid #334155;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      color: #94A3B8;
    }
    pre {
      padding: 22px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      line-height: 1.65;
      color: #F1F5F9;
    }
    .screenshots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
      margin-top: 16px;
    }
    .screenshot-card {
      background: #FFFFFF;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      overflow: hidden;
      padding: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      transition: all 0.2s ease;
    }
    .screenshot-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }
    .screenshot-card img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
      border: 1px solid var(--card-border);
    }
    .screenshot-caption {
      font-size: 0.78rem;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-muted);
      margin-top: 8px;
      text-align: center;
    }
    .live-runner {
      background: #0F172A;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
      margin-top: 20px;
      font-family: 'JetBrains Mono', monospace;
    }
    .terminal-output {
      background: #020617;
      border: 1px solid #1E293B;
      border-radius: 8px;
      padding: 14px;
      font-size: 0.85rem;
      color: #38BDF8;
      white-space: pre-wrap;
      margin-top: 12px;
      min-height: 60px;
    }
  </style>
`;

/*
|--------------------------------------------------------------------------
| ROUTE HANDLERS
|--------------------------------------------------------------------------
*/

// GET / - Production-grade Portal Page
async function handleHome(req, res) {
    const isLive = Boolean(process.env.RENDER);
    const envLabel = isLive ? 'RUNNING: LIVE (RENDER)' : 'RUNNING: LOCAL (:3000)';

    let screenshotsCount = 0;
    try {
        const files = await fs.promises.readdir(SCREENSHOTS_DIR);
        screenshotsCount = files.filter(f => /\.(png|jpe?g)$/i.test(f)).length;
    } catch (e) {}

    let requestsCount = 0;
    try {
        if (fs.existsSync(LOG_FILE)) {
            const data = await fs.promises.readFile(LOG_FILE, 'utf8');
            requestsCount = data.trim().split('\n').filter(Boolean).length;
        }
    } catch (e) {}

    // Categorize Labs
    const serverLabs = labs.filter(l => l.type === 'server');
    const scriptLabs = labs.filter(l => l.type === 'script');

    function renderLabCard(lab) {
        const isServer = lab.type === 'server';
        const tagClass = isServer ? 'tag-server' : 'tag-script';
        const tagText = isServer ? 'Server API' : 'Script Process';
        const routeMethod = isServer ? `GET /labs/${lab.id}/app${lab.try || '/'}` : `GET /labs/${lab.id}/run`;

        let actionBtn = '';
        if (isServer) {
            const sampleUrl = `/labs/${lab.id}/app${lab.try || '/'}`;
            actionBtn = `<a href="${sampleUrl}" target="_blank" class="btn-live-act" id="open-lab-${lab.id}">⚡ Live Route</a>`;
        } else {
            actionBtn = `<a href="/labs/${lab.id}/run" target="_blank" class="btn-run-act" id="run-lab-${lab.id}">▶ Run Output</a>`;
        }

        return `
            <div class="lab-card" id="card-lab-${lab.id}">
              <div>
                <div class="lab-card-top">
                  <span class="lab-id-pill">LAB ${lab.id}</span>
                  <span class="lab-type-tag ${tagClass}">${tagText}</span>
                </div>
                <h3 class="lab-card-title">${escapeHtml(lab.title)}</h3>
                <span class="lab-route-badge">${escapeHtml(routeMethod)}</span>
                <p class="lab-card-desc">${escapeHtml(lab.topic)}</p>
              </div>
              <div class="lab-card-actions">
                <a href="/labs/${lab.id}" class="btn-inspect" id="view-lab-${lab.id}">Inspect Route & Code</a>
                ${actionBtn}
              </div>
            </div>
        `;
    }

    const serverCardsHtml = serverLabs.map(renderLabCard).join('');
    const scriptCardsHtml = scriptLabs.map(renderLabCard).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Node.js Integrated Lab Portal (Lab 01 – Lab 07)</title>
  <meta name="description" content="Production-grade single-page developer dashboard integrating 7 Node.js laboratories into one unified system.">
  ${sharedStyles}
</head>
<body>

  <!-- 1. NAVBAR -->
  <nav class="navbar">
    <div class="container navbar-inner">
      <a href="/" class="brand-link">
        <div class="brand-logo-hex">
          <!-- Node.js Hexagon SVG Icon -->
          <svg viewBox="0 0 256 289" width="22" height="25" fill="currentColor">
            <path d="M128 0L0 73.8v147.6L128 295.2l128-73.8V73.8L128 0zm96.6 206.1L128 261.7l-96.6-55.6V92.9L128 37.3l96.6 55.6v113.2z"/>
            <path d="M128 65.5l-65.7 37.9v75.9L128 217.2l65.7-37.9v-75.9L128 65.5z"/>
          </svg>
        </div>
        <div>
          <span class="brand-title">Node.js Integrated Lab Portal</span>
          <span class="brand-subtitle">CS403NOD &middot; Distributed Laboratory Architecture</span>
        </div>
      </a>

      <div class="navbar-right">
        <div class="student-chip">
          <span>Student: <strong>${escapeHtml(process.env.STUDENT_NAME || 'Pragya Gupta')}</strong> &bull; BCA Semester VII &bull; Scholar No: <strong>23145013</strong></span>
        </div>
        <div class="env-status-badge" id="env-badge">
          <span class="pulse-dot"></span>
          <span>${envLabel}</span>
        </div>
      </div>
    </div>
  </nav>

  <div class="container">

    <!-- 2. METRIC / TELEMETRY BAR (4-COLUMN BENTO ROW) -->
    <section class="telemetry-row">
      <!-- Card 1 -->
      <div class="bento-card">
        <div class="bento-header">
          <span class="bento-title">Total Integrated Labs</span>
          <div class="bento-icon icon-green">&#128193;</div>
        </div>
        <div class="bento-value" id="stat-total-labs">${labs.length}</div>
        <div class="bento-subtext">
          <span style="color: var(--node-green); font-weight: 700;">&check;</span> 100% Importable & Reusable
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bento-card">
        <div class="bento-header">
          <span class="bento-title">Server Uptime</span>
          <div class="bento-icon icon-mint">&#9201;</div>
        </div>
        <div class="bento-value" id="live-uptime">00:00:00</div>
        <div class="bento-subtext">
          <span style="color: var(--node-mint); font-weight: 700;">&bull;</span> Real-time execution ticker
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bento-card">
        <div class="bento-header">
          <span class="bento-title">Requests Logged</span>
          <div class="bento-icon icon-forest">&#128225;</div>
        </div>
        <div class="bento-value" id="stat-requests">${requestsCount}</div>
        <div class="bento-subtext">
          <span style="color: var(--node-green); font-weight: 700;">&bull;</span> Tracked via EventEmitter
        </div>
      </div>

      <!-- Card 4 -->
      <div class="bento-card">
        <div class="bento-header">
          <span class="bento-title">Screenshots Stored</span>
          <div class="bento-icon icon-slate">&#128248;</div>
        </div>
        <div class="bento-value" id="stat-screenshots">${screenshotsCount}</div>
        <div class="bento-subtext">
          <span style="color: var(--node-green); font-weight: 700;">&check;</span> Verified with visual proofs
        </div>
      </div>
    </section>

    <!-- 3. INTERACTIVE QUICK ENDPOINT PILLS -->
    <section class="endpoints-bar">
      <span class="endpoints-label">&#9889; Interactive API Endpoints:</span>
      <button onclick="inspectEndpoint('/about')" class="endpoint-pill" id="pill-about">
        <span class="method-get">GET</span> /about
      </button>
      <button onclick="inspectEndpoint('/health')" class="endpoint-pill" id="pill-health">
        <span class="method-get">GET</span> /health
      </button>
      <button onclick="inspectEndpoint('/labs')" class="endpoint-pill" id="pill-labs">
        <span class="method-get">GET</span> /labs
      </button>
      <button onclick="inspectEndpoint('/api/dashboard')" class="endpoint-pill" id="pill-dashboard">
        <span class="method-get">GET</span> /api/dashboard
      </button>
    </section>

    <!-- 4. HERO SECTION (SPLIT 2-COLUMN) -->
    <section class="hero-section" id="hero-banner">
      <!-- Left Column -->
      <div>
        <div class="hero-tag">
          <span>&#10024;</span>
          <span>CS403NOD &bull; Node.js Laboratory Portfolio</span>
        </div>
        <h1 class="hero-title">
          Explore 7 Practical Node.js Labs In <span class="node-gradient">One Integrated System</span>
        </h1>
        <p class="hero-desc">
          A production-grade developer platform unifying standalone HTTP servers, dynamic REST APIs, asynchronous food delivery trackers, file system persistence, and EventEmitter-powered telemetry pipelines—engineered with zero code rewrites.
        </p>
        <div class="hero-cta">
          <a href="#lab-directory" class="btn btn-node" id="btn-hero-explore">
            &#9889; Explore Labs Below
          </a>
          <button onclick="inspectEndpoint('/api/dashboard')" class="btn btn-outline" id="btn-hero-metrics">
            &#128202; Live Metrics API
          </button>
        </div>
        <div class="hero-checklist">
          <span class="checklist-item"><span class="check-icon">&#10003;</span> Zero Code Rewrites</span>
          <span class="checklist-item"><span class="check-icon">&#10003;</span> Dynamic URL Proxying</span>
          <span class="checklist-item"><span class="check-icon">&#10003;</span> Isolated Child Process Runners</span>
        </div>
      </div>

      <!-- Right Column: Sleek Terminal -->
      <div class="terminal-window">
        <div class="terminal-header">
          <div class="mac-lights">
            <span class="mac-light light-red"></span>
            <span class="mac-light light-yellow"></span>
            <span class="mac-light light-green"></span>
          </div>
          <span class="terminal-title">server.js &bull; Live Architecture Hub</span>
        </div>
        <div class="terminal-body">
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #1E293B;">
            <span style="color: #94A3B8; font-size: 0.76rem;">DISPATCH PIPELINE</span>
            <span style="color: #34D399; font-weight: 700; font-size: 0.78rem;">● PORT :3000 (0.0.0.0)</span>
          </div>
          <div class="code-pipeline">
            <span style="color: #94A3B8;">// Route Mapping Matrix</span><br>
            <span style="color: #5FA04E;">GET /labs/:id/app/*</span> <span style="color: #64748B;">&rarr;</span> <span style="color: #F8FAFC;">require(lab)(req, res)</span><br>
            <span style="color: #5FA04E;">GET /labs/:id/run</span>   <span style="color: #64748B;">&rarr;</span> <span style="color: #F8FAFC;">execFile(Node, 5000ms)</span><br>
            <span style="color: #5FA04E;">* (Every Request)</span>   <span style="color: #64748B;">&rarr;</span> <span style="color: #38BDF8;">logger.emit('request')</span>
          </div>
          <div class="terminal-chips">
            <div class="terminal-chip">
              <div class="chip-label">Runtime Engine</div>
              <div class="chip-value" style="color: #34D399;">Node.js ${process.version}</div>
            </div>
            <div class="terminal-chip">
              <div class="chip-label">Architecture</div>
              <div class="chip-value" style="color: #38BDF8;">Event-Driven</div>
            </div>
            <div class="terminal-chip">
              <div class="chip-label">Server Labs</div>
              <div class="chip-value" style="color: #F8FAFC;">Lab 01 &ndash; 04</div>
            </div>
            <div class="terminal-chip">
              <div class="chip-label">Script Labs</div>
              <div class="chip-value" style="color: #F8FAFC;">Lab 05 &ndash; 07</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. LAB DIRECTORY GRID -->
    <section id="lab-directory">
      <div class="section-header">
        <h2 class="section-title">
          <span>&#128218;</span> Laboratory Directory
        </h2>
        <p class="section-desc">Browse, execute, and inspect all seven modular laboratory implementations.</p>
      </div>

      <!-- Server Labs Section -->
      <div class="category-divider">
        <span class="category-badge cat-server">Server Labs (01 &ndash; 04)</span>
        <div class="cat-line"></div>
      </div>
      <div class="labs-grid">
        ${serverCardsHtml}
      </div>

      <!-- Script & Process Labs Section -->
      <div class="category-divider">
        <span class="category-badge cat-script">Script & Process Labs (05 &ndash; 07)</span>
        <div class="cat-line"></div>
      </div>
      <div class="labs-grid">
        ${scriptCardsHtml}
      </div>
    </section>

  </div>

  <!-- 6. MODAL DRAWER FOR INTERACTIVE ENDPOINTS -->
  <div class="modal-overlay" id="api-modal" onclick="closeModalOnBackdrop(event)">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title-group">
          <span class="modal-endpoint-title" id="modal-route">GET /about</span>
          <span class="modal-badge-status" id="modal-status">200 OK</span>
          <span class="modal-badge-latency" id="modal-latency">4ms</span>
        </div>
        <button onclick="closeModal()" class="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <pre class="modal-pre"><code id="modal-json-content">Loading...</code></pre>
      </div>
      <div class="modal-footer">
        <span style="font-size: 0.8rem; color: var(--text-muted);">Content-Type: application/json</span>
        <div style="display: flex; gap: 8px;">
          <button onclick="copyModalJson()" class="btn btn-secondary" id="btn-copy-modal" style="padding: 6px 14px; font-size: 0.8rem;">
            📋 Copy JSON
          </button>
          <button onclick="closeModal()" class="btn btn-outline" style="padding: 6px 14px; font-size: 0.8rem;">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Client-side Telemetry Script -->
  <script>
    // Live ticking uptime counter (hh:mm:ss)
    let uptimeSeconds = ${Math.floor(process.uptime())};
    function updateUptime() {
      uptimeSeconds++;
      const hrs = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
      const secs = String(uptimeSeconds % 60).padStart(2, '0');
      document.getElementById('live-uptime').innerText = hrs + ':' + mins + ':' + secs;
    }
    setInterval(updateUptime, 1000);
    updateUptime();

    // Interactive Endpoint Modal Inspector
    function inspectEndpoint(route) {
      const modal = document.getElementById('api-modal');
      const title = document.getElementById('modal-route');
      const status = document.getElementById('modal-status');
      const latency = document.getElementById('modal-latency');
      const jsonContent = document.getElementById('modal-json-content');

      title.innerText = 'GET ' + route;
      status.innerText = 'FETCHING...';
      status.style.background = '#F1F5F9';
      status.style.color = '#64748B';
      jsonContent.innerText = 'Querying endpoint ' + route + '...';
      modal.style.display = 'flex';

      const t0 = performance.now();
      fetch(route)
        .then(res => {
          const t1 = performance.now();
          latency.innerText = Math.round(t1 - t0) + 'ms';
          status.innerText = res.status + ' ' + res.statusText;
          status.style.background = '#ECFDF5';
          status.style.color = '#047857';
          return res.json();
        })
        .then(data => {
          jsonContent.innerText = JSON.stringify(data, null, 2);
        })
        .catch(err => {
          status.innerText = 'ERR';
          status.style.background = '#FEE2E2';
          status.style.color = '#B91C1C';
          jsonContent.innerText = 'Error: ' + err.message;
        });
    }

    function closeModal() {
      document.getElementById('api-modal').style.display = 'none';
    }

    function closeModalOnBackdrop(e) {
      if (e.target.id === 'api-modal') {
        closeModal();
      }
    }

    function copyModalJson() {
      const text = document.getElementById('modal-json-content').innerText;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-copy-modal');
        btn.innerText = '✓ Copied!';
        setTimeout(() => btn.innerText = '📋 Copy JSON', 2000);
      });
    }
  </script>
</body>
</html>`;

    send(res, 200, html);
}

// GET /about - Project and Student Info
function handleAbout(req, res) {
    send(res, 200, {
        project: 'Node.js Integrated Lab Portal',
        studentName: process.env.STUDENT_NAME || 'Pragya Gupta',
        scholarNumber: '23145013',
        course: 'BCA (Semester VII)',
        subject: 'CS403NOD - Node.js Laboratory',
        institution: 'Dev Sanskriti Vishwavidyalaya',
        totalLabs: labs.length
    });
}

// GET /health - Environment & Status
function handleHealth(req, res) {
    const environment = process.env.RENDER ? 'live (Render)' : 'local';
    send(res, 200, {
        status: 'OK',
        environment,
        uptimeSeconds: Math.floor(process.uptime())
    });
}

// GET /labs - All labs with slugified title
function handleLabs(req, res) {
    const slugifiedLabs = labs.map(lab => ({
        ...lab,
        slug: slugify(lab.title, { lower: true, strict: true })
    }));
    send(res, 200, slugifiedLabs);
}

// GET /labs/:id - HTML details, source code, and screenshots
async function handleLabDetail(req, res, labId) {
    const lab = labs.find(l => l.id === labId);
    if (!lab) {
        return send(res, 404, { error: 'Lab not found', id: labId });
    }

    const resolvedFile = resolveLabFile(lab.file);
    let sourceCode = '';
    try {
        sourceCode = await fs.promises.readFile(resolvedFile, 'utf8');
    } catch (err) {
        sourceCode = `// Error reading file: ${err.message}`;
    }

    // Read screenshots for this lab
    let matchedScreenshots = [];
    try {
        const files = await fs.promises.readdir(SCREENSHOTS_DIR);
        const idNum = parseInt(labId, 10);
        matchedScreenshots = files.filter(f => {
            const lower = f.toLowerCase();
            return lower.startsWith(`lab${labId.toLowerCase()}`) || 
                   lower.startsWith(`lab0${idNum}`) || 
                   lower.startsWith(`lab${idNum}`);
        });
    } catch (e) {}

    const isServer = lab.type === 'server';
    const tagClass = isServer ? 'tag-server' : 'tag-script';
    const tagText = isServer ? 'Server API Lab' : 'Script Process Lab';

    let actionSection = '';
    if (isServer) {
        const sampleUrl = `/labs/${lab.id}/app${lab.try || '/'}`;
        actionSection = `
          <div style="margin-top: 16px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <a href="${sampleUrl}" target="_blank" class="btn btn-node" id="btn-launch-live">
              ⚡ Open Live API Endpoint (${sampleUrl})
            </a>
            <span style="font-size: 0.85rem; color: var(--text-muted);">
              Proxied live through <code>/labs/${lab.id}/app/...</code>
            </span>
          </div>
        `;
    } else {
        const runUrl = `/labs/${lab.id}/run`;
        actionSection = `
          <div style="margin-top: 16px;">
            <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
              <button onclick="runLabScript('${lab.id}')" class="btn btn-node" id="btn-run-script">
                ▶ Execute Script Live (child_process)
              </button>
              <a href="${runUrl}" target="_blank" class="btn btn-outline">
                View Raw JSON Output
              </a>
            </div>
            <div id="live-runner-${lab.id}" class="live-runner" style="display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; color: #94A3B8; font-size: 0.8rem;">
                <span>STDOUT & STDERR LOG</span>
                <span id="run-status-${lab.id}">Running...</span>
              </div>
              <div id="run-output-${lab.id}" class="terminal-output">Executing script...</div>
            </div>
          </div>
        `;
    }

    const screenshotsHtml = matchedScreenshots.length > 0
        ? matchedScreenshots.map(file => `
            <div class="screenshot-card">
              <a href="/screenshots/${encodeURIComponent(file)}" target="_blank">
                <img src="/screenshots/${encodeURIComponent(file)}" alt="${file}" loading="lazy">
              </a>
              <div class="screenshot-caption">${escapeHtml(file)}</div>
            </div>
          `).join('')
        : `<p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">No screenshots found for this lab yet. Add them to <code>public/screenshots/lab${lab.id}-*.png</code>.</p>`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Lab ${lab.id}: ${escapeHtml(lab.title)} | Integrated Portal</title>
  <meta name="description" content="View source code and verification for Lab ${lab.id} (${escapeHtml(lab.title)}).">
  ${sharedStyles}
</head>
<body>
  <nav class="navbar">
    <div class="container navbar-inner">
      <a href="/" class="brand-link">
        <div class="brand-logo-hex">
          <svg viewBox="0 0 256 289" width="22" height="25" fill="currentColor">
            <path d="M128 0L0 73.8v147.6L128 295.2l128-73.8V73.8L128 0zm96.6 206.1L128 261.7l-96.6-55.6V92.9L128 37.3l96.6 55.6v113.2z"/>
          </svg>
        </div>
        <span class="brand-title">Node.js Integrated Lab Portal</span>
      </a>
      <a href="/" class="btn btn-outline" style="font-size: 0.82rem; padding: 6px 14px;">
        &larr; Back to Directory
      </a>
    </div>
  </nav>

  <div class="container">
    <div class="breadcrumbs">
      <a href="/">Portal Home</a>
      <span>&bull;</span>
      <span>Lab ${lab.id}</span>
    </div>

    <div class="detail-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span class="lab-id-pill">LAB ${lab.id}</span>
            <span class="lab-type-tag ${tagClass}">${tagText}</span>
          </div>
          <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-main);">${escapeHtml(lab.title)}</h1>
          <p style="color: var(--text-muted); margin-top: 4px; font-size: 1rem;"><strong>Topic:</strong> ${escapeHtml(lab.topic)}</p>
          <p style="color: var(--text-muted); font-size: 0.85rem; font-family: 'JetBrains Mono', monospace; margin-top: 4px;">File: ${escapeHtml(lab.file)}</p>
        </div>
      </div>
      ${actionSection}
    </div>

    <main>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-main);">Complete Source Code</h2>
        <button onclick="copyCode()" class="btn btn-secondary" id="btn-copy-code" style="padding: 6px 14px; font-size: 0.8rem;">
          📋 Copy Code
        </button>
      </div>

      <div class="code-viewer">
        <div class="code-viewer-header">
          <span>${escapeHtml(path.basename(lab.file))}</span>
          <span>UTF-8 &bull; Read via fs.promises.readFile</span>
        </div>
        <pre><code id="source-code">${escapeHtml(sourceCode)}</code></pre>
      </div>

      <div style="margin-top: 36px;">
        <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-main);">Verification Screenshots</h2>
        <div class="screenshots-grid">
          ${screenshotsHtml}
        </div>
      </div>
    </main>
  </div>

  <script>
    function copyCode() {
      const code = document.getElementById('source-code').innerText;
      navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('btn-copy-code');
        btn.innerText = '✓ Copied!';
        setTimeout(() => btn.innerText = '📋 Copy Code', 2000);
      });
    }

    function runLabScript(id) {
      const runner = document.getElementById('live-runner-' + id);
      const out = document.getElementById('run-output-' + id);
      const status = document.getElementById('run-status-' + id);
      runner.style.display = 'block';
      status.innerText = 'Running...';
      out.innerText = 'Executing child_process.execFile...';

      fetch('/labs/' + id + '/run')
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            status.innerText = '✓ Exit 0';
            status.style.color = '#34D399';
            out.innerText = data.output || '(No stdout produced)';
          } else {
            status.innerText = '✗ Error';
            status.style.color = '#F87171';
            out.innerText = 'Error: ' + data.error + (data.output ? '\\n\\nOutput:\\n' + data.output : '');
          }
        })
        .catch(err => {
          status.innerText = '✗ Network Error';
          status.style.color = '#F87171';
          out.innerText = err.message;
        });
    }
  </script>
</body>
</html>`;

    send(res, 200, html);
}

// GET /labs/:id/run - Script execution via child_process
function handleLabRun(req, res, labId) {
    const lab = labs.find(l => l.id === labId);
    if (!lab) {
        return send(res, 404, { error: 'Lab not found', id: labId });
    }

    if (lab.type === 'server') {
        return send(res, 400, {
            error: `Lab ${labId} is a server lab. Use /labs/${labId}/app/... instead.`
        });
    }

    const resolvedFile = resolveLabFile(lab.file);
    execFile(
        process.execPath,
        [resolvedFile],
        { timeout: 5000, cwd: path.dirname(resolvedFile) },
        (err, stdout, stderr) => {
            if (err) {
                return send(res, 200, {
                    ok: false,
                    output: stdout ? stdout.trim() : '',
                    error: err.message || (stderr ? stderr.trim() : 'Execution failed')
                });
            }

            send(res, 200, {
                ok: true,
                output: (stdout || '').trim(),
                error: stderr && stderr.trim() ? stderr.trim() : null
            });
        }
    );
}

// GET /labs/:id/app/... - Server lab proxy
function handleLabApp(req, res, labId) {
    const lab = labs.find(l => l.id === labId);
    if (!lab) {
        return send(res, 404, { error: 'Lab not found', id: labId });
    }

    if (lab.type === 'script') {
        return send(res, 400, {
            error: `Lab ${labId} is a script lab. Use /labs/${labId}/run instead.`
        });
    }

    // Strip prefix: /labs/:id/app
    const prefix = `/labs/${labId}/app`;
    let subUrl = req.url.slice(prefix.length);
    if (!subUrl || subUrl === '') {
        subUrl = '/';
    } else if (subUrl.startsWith('?')) {
        subUrl = '/' + subUrl;
    }
    req.url = subUrl;

    const resolvedFile = resolveLabFile(lab.file);
    try {
        const handler = require(resolvedFile);
        if (typeof handler === 'function') {
            handler(req, res);
        } else {
            send(res, 500, { error: `Lab ${labId} did not export a request handler function.` });
        }
    } catch (err) {
        send(res, 500, { error: 'Internal Server Error', message: err.message });
    }
}

// GET /screenshots/:name - Stream image
function handleScreenshot(req, res, filename) {
    const safeName = path.basename(filename);
    const ext = path.extname(safeName).toLowerCase();

    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
        return send(res, 404, { error: 'Invalid file format. Only .png, .jpg, .jpeg allowed.' });
    }

    const filePath = path.join(SCREENSHOTS_DIR, safeName);
    if (!fs.existsSync(filePath)) {
        return send(res, 404, { error: 'Screenshot not found', filename: safeName });
    }

    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    res.writeHead(200, { 'Content-Type': mime });
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
        if (!res.headersSent) {
            send(res, 500, { error: 'Error reading screenshot' });
        }
    });
    stream.pipe(res);
}

// GET /api/dashboard - Promise.all reading log file and screenshots folder
async function handleDashboard(req, res) {
    const readLogPromise = fs.promises.readFile(LOG_FILE, 'utf8')
        .then(data => data.trim().split('\n').filter(Boolean).length)
        .catch(() => 0);

    const readScreenshotsPromise = fs.promises.readdir(SCREENSHOTS_DIR)
        .then(files => files.filter(f => /\.(png|jpe?g)$/i.test(f)))
        .catch(() => []);

    try {
        const [requestsLogged, screenshots] = await Promise.all([
            readLogPromise,
            readScreenshotsPromise
        ]);

        send(res, 200, {
            labs: labs.map(lab => ({
                ...lab,
                slug: slugify(lab.title, { lower: true, strict: true })
            })),
            totalLabs: labs.length,
            screenshots,
            requestsLogged
        });
    } catch (err) {
        send(res, 500, { error: 'Failed to load dashboard data', message: err.message });
    }
}

/*
|--------------------------------------------------------------------------
| MAIN HTTP SERVER
|--------------------------------------------------------------------------
*/
const server = http.createServer(async (req, res) => {
    try {
        // Emit logger request event
        logger.emit('request', req.method, req.url);

        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        // Route: GET /
        if (pathname === '/' && req.method === 'GET') {
            return await handleHome(req, res);
        }

        // Route: GET /about
        if (pathname === '/about' && req.method === 'GET') {
            return handleAbout(req, res);
        }

        // Route: GET /health
        if (pathname === '/health' && req.method === 'GET') {
            return handleHealth(req, res);
        }

        // Route: GET /labs
        if (pathname === '/labs' && req.method === 'GET') {
            return handleLabs(req, res);
        }

        // Route: GET /api/dashboard
        if (pathname === '/api/dashboard' && req.method === 'GET') {
            return await handleDashboard(req, res);
        }

        // Route: GET /screenshots/<name>
        if (pathname.startsWith('/screenshots/') && req.method === 'GET') {
            const name = pathname.replace('/screenshots/', '');
            return handleScreenshot(req, res, name);
        }

        // Route: /labs/:id/app or /labs/:id/app/...
        const appMatch = pathname.match(/^\/labs\/([^\/]+)\/app(\/.*)?$/);
        if (appMatch) {
            const labId = appMatch[1];
            return handleLabApp(req, res, labId);
        }

        // Route: GET /labs/:id/run
        const runMatch = pathname.match(/^\/labs\/([^\/]+)\/run$/);
        if (runMatch) {
            const labId = runMatch[1];
            return handleLabRun(req, res, labId);
        }

        // Route: GET /labs/:id
        const labMatch = pathname.match(/^\/labs\/([^\/]+)$/);
        if (labMatch && req.method === 'GET') {
            const labId = labMatch[1];
            return await handleLabDetail(req, res, labId);
        }

        // Unknown route -> 404
        send(res, 404, {
            error: 'Route not found',
            path: pathname
        });
    } catch (err) {
        console.error('Unhandled server error:', err);
        send(res, 500, {
            error: 'Internal Server Error'
        });
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
