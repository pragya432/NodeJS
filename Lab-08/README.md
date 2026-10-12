# Lab 08: Integrated Node.js Server Portal

## Student & Course Details
- **Student Name:** Pragya Gupta
- **Scholar Number:** 23145013
- **Class / Course:** Bachelor of Computer Applications (BCA) – Semester VII
- **Subject:** CS403NOD – Node.js Laboratory
- **Institution:** Dev Sanskriti Vishwavidyalaya
- **Date:** October 2026

---

## Project Overview
This project brings together all previous lab assignments (**Lab 01 through Lab 07**) into **one unified, production-ready Node.js server** without rewriting their original source code. 

Using Node.js native architecture (`module.exports`, `require()`, `child_process`, `events`, and `fs`), the server:
- Proxies HTTP requests to old **Server Labs** (`Lab-01`, `Lab-02`, `Lab-03`, `Lab-04`) via dynamic route delegating under `/labs/<id>/app/...`.
- Executes standalone **Script Labs** (`Lab-05`, `Lab-06`, `Lab-07`) in isolated child processes with a 5000ms safety timeout and returns their live standard output via `/labs/<id>/run`.
- Serves an interactive, glassmorphic web portal displaying lab metadata, live output, complete syntax-highlighted source code, and verification screenshots.
- Features an event-driven `Logger` module extending `EventEmitter` that logs every request with ISO timestamps to `logs/server.log`.
- Runs seamlessly both locally (`localhost:3000`) and live on **Render** (free tier).

---

## Included Laboratories

| Lab ID | Lab Title | Topic / Concepts | Lab Type | File Path | Sample Endpoint |
|---|---|---|---|---|---|
| **01** | Simple HTTP Server | `http` module, request handling, status codes | Server | `../Lab-01/server.js` | `/` |
| **02** | Student Directory & Profile API | JSON responses, query parameters, HTTP routing | Server | `../Lab-02/server.js` | `/students?course=BCA` |
| **03** | Student Directory API | RESTful routing, array methods (`find`, `filter`) | Server | `../Lab-03/students-server.js` | `/students` |
| **04** | Advanced Search Filter & Sort API | Multi-field query filtering, minMarks, sorting | Server | `../Lab-04/advanced-server.js` | `/students?course=BCA&minMarks=80` |
| **05** | Async Food Delivery Tracker | Callbacks, Promises, `async/await`, Event Loop | Script | `../Lab-05/async-await-version.js` | `/labs/05/run` |
| **06** | File System Operations (fs) | `fs` module, async file reading & error callbacks | Script | `../Lab-06/read-async.js` | `/labs/06/run` |
| **07** | EventEmitter & Order Tracker | `events` module, custom `EventEmitter`, lifecycle | Script | `../Lab-07/order-tracker.js` | `/labs/07/run` |

---

## Complete Route Reference

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | **Portal Home Page (HTML):** Displays environment status (`local` vs `live (Render)`), system stats, API links, and interactive cards for all 7 labs. |
| `GET` | `/about` | **JSON:** Project name, student name (`process.env.STUDENT_NAME`), scholar number, and total lab count. |
| `GET` | `/health` | **JSON:** `{ status, environment, uptimeSeconds }`. `environment` is `live (Render)` when `process.env.RENDER` exists, otherwise `local`. |
| `GET` | `/labs` | **JSON:** List of all registered labs from `labs.js` with slugified titles generated via the `slugify` package. |
| `GET` | `/labs/:id` | **HTML:** Individual lab portal page with title, topic, execution link/button, escaped source code, and verification screenshots. |
| `GET` | `/labs/:id/run` | **JSON (Script Labs):** Executes the lab script using `child_process.execFile(process.execPath, [file], { timeout: 5000 })` and returns `{ ok, output, error }`. Calling `/run` on a server lab returns `400 Bad Request`. |
| `GET` | `/labs/:id/app/...` | **Server Labs:** Strips `/labs/<id>/app` prefix from the URL, preserves query strings, and invokes the exported handler: `require(file)(req, res)`. Calling `/app` on a script lab returns `400 Bad Request`. |
| `GET` | `/screenshots/<name>` | **Image Stream:** Streams image from `public/screenshots/` using `fs.createReadStream`. Protected with `path.basename()` against traversal. Supports `.png`, `.jpg`, `.jpeg`. |
| `GET` | `/api/dashboard` | **JSON:** Uses `Promise.all` to read `logs/server.log` and `public/screenshots/` simultaneously; returns `{ labs, screenshots, requestsLogged }`. |
| `*` | Any other route | **404 JSON:** `{ error: "Route not found", path }`. |

---

## Technologies Used
- **Core Node.js Modules:**
  - `http` – Primary web server and request/response dispatching.
  - `fs` & `fs.promises` – Asynchronous directory traversal, file streaming, and source code reading.
  - `events` (`EventEmitter`) – Event-driven architecture powering `modules/logger.js`.
  - `child_process` (`execFile`) – Safe, timeout-governed execution of script labs.
  - `path` & `url` – URL parameter parsing and secure cross-platform path resolution.
- **Third-Party Package:**
  - `slugify` (v1.6.9) – Automatic slug generation for lab titles.
- **Frontend / Aesthetics:**
  - Modern HTML5 semantic markup, CSS Glassmorphism, Google Fonts (`Outfit`, `JetBrains Mono`), responsive CSS Grid, and live execution terminal UI.

---

## How to Run Locally

### 1. Prerequisites
- Node.js (v18.x, v20.x, or v24.x recommended)
- Git

### 2. Installation
Open your terminal in the `Lab-08` folder:
```bash
cd Lab-08
npm install
```

### 3. Start the Server
```bash
npm start
```
*Alternatively:*
```bash
node server.js
```

### 4. Test Local Endpoints
Open your web browser or run curl:
- **Portal:** [http://localhost:3000/](http://localhost:3000/)
- **Health:** [http://localhost:3000/health](http://localhost:3000/health)
- **About:** [http://localhost:3000/about](http://localhost:3000/about)
- **Labs JSON:** [http://localhost:3000/labs](http://localhost:3000/labs)
- **Lab 01 Code & Screenshots:** [http://localhost:3000/labs/01](http://localhost:3000/labs/01)
- **Lab 01 Live App:** [http://localhost:3000/labs/01/app/](http://localhost:3000/labs/01/app/)
- **Lab 02 Filtered Students:** [http://localhost:3000/labs/02/app/students?course=BCA](http://localhost:3000/labs/02/app/students?course=BCA)
- **Lab 03 Live App:** [http://localhost:3000/labs/03/app/students](http://localhost:3000/labs/03/app/students)
- **Lab 04 Filtered App:** [http://localhost:3000/labs/04/app/students?course=BCA&minMarks=80](http://localhost:3000/labs/04/app/students?course=BCA&minMarks=80)
- **Lab 05 Async Run:** [http://localhost:3000/labs/05/run](http://localhost:3000/labs/05/run)
- **Lab 06 fs Run:** [http://localhost:3000/labs/06/run](http://localhost:3000/labs/06/run)
- **Lab 07 EventEmitter Run:** [http://localhost:3000/labs/07/run](http://localhost:3000/labs/07/run)
- **API Dashboard:** [http://localhost:3000/api/dashboard](http://localhost:3000/api/dashboard)
- **404 Test:** [http://localhost:3000/labs/99](http://localhost:3000/labs/99)

---

## Live Deployment on Render (Free Tier)

### Step-by-Step Instructions
1. Push all changes to GitHub:
   ```bash
   git add .
   git commit -m "Lab 08 Submission - Integrated Lab Server"
   git push origin main
   ```
2. Log in to [render.com](https://render.com) using your GitHub account.
3. Click **New +** → **Web Service** and connect your `NodeJS-Lab` repository.
4. Configure the Web Service settings:
   - **Name:** `nodejs-lab-portal` (or your preferred name)
   - **Region:** Any (e.g., Singapore or Frankfurt)
   - **Branch:** `main`
   - **Root Directory:** *Leave blank* (Render needs access to all parent lab folders)
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     for d in */; do if [ -f "$d/package.json" ]; then (cd "$d" && npm install); fi; done
     ```
   - **Start Command:**
     ```bash
     node Lab-08/server.js
     ```
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   - `STUDENT_NAME` = `Pragya Gupta`
6. Click **Create Web Service**.
7. Once deployment finishes, Render provides your live URL:
   `https://<your-service-name>.onrender.com`

### Live URL
- **Production URL:** `https://nodejs-integrated-portal.onrender.com` *(Update with your deployed service domain)*

---

## Screenshots & Verification
Screenshots are organized in `Lab-08/public/screenshots/`:
- **Local Runs:**
  - `lab01-local.png` – Lab 01 Simple HTTP Server local output
  - `lab02-local.png` – Lab 02 Student Directory & Profile local output
  - `lab03-local.png` – Lab 03 Student Directory API local output
  - `lab04-local.png` – Lab 04 Advanced Filter & Sort local output
  - `lab05-local.png` – Lab 05 Async Food Delivery Tracker local run
  - `lab06-local.png` – Lab 06 File System Operations local run
  - `lab07-local.png` – Lab 07 EventEmitter Order Tracker local run
- **Live Runs (Render):**
  - `lab01-live.png` through `lab07-live.png` – Captured from the live Render URL.

---

## What I Learned
1. **Module Reusability & Conditional Execution:** Learned how `module.exports` paired with `if (require.main === module)` allows the exact same Node.js server file to operate both as an independent standalone server and as an importable request handler without code duplication.
2. **Event-Driven Asynchronous Logging:** Mastered extending Node.js's native `EventEmitter` class to build custom, non-blocking loggers that handle concurrent events and gracefully safeguard against application crashes using error listeners.
3. **Child Process Orchestration:** Gained hands-on experience using `child_process.execFile` with timeouts and directory isolation to execute external scripts safely inside an HTTP pipeline.
4. **Cloud Deployment & Environment Awareness:** Understood production hosting on Render, handling dynamic `PORT` assignment (`0.0.0.0`), reading environment flags (`process.env.RENDER`), and structuring repositories for cloud build steps.
