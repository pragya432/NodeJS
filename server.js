const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

/*
|--------------------------------------------------------------------------
| MIME TYPES
|--------------------------------------------------------------------------
*/

const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

/*
|--------------------------------------------------------------------------
| SEND FILE
|--------------------------------------------------------------------------
*/

function sendFile(res, filePath) {
    fs.readFile(filePath, (error, data) => {

        if (error) {
            res.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });

            res.end("404 - File Not Found");
            return;
        }

        const extension = path.extname(filePath).toLowerCase();

        const contentType =
            mimeTypes[extension] ||
            "application/octet-stream";

        res.writeHead(200, {
            "Content-Type": contentType
        });

        res.end(data);
    });
}

/*
|--------------------------------------------------------------------------
| SAFE PATH CHECK
|--------------------------------------------------------------------------
*/

function isSafePath(filePath, baseDirectory) {
    const resolvedFile = path.resolve(filePath);
    const resolvedBase = path.resolve(baseDirectory);

    return (
        resolvedFile === resolvedBase ||
        resolvedFile.startsWith(resolvedBase + path.sep)
    );
}

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/

const server = http.createServer((req, res) => {

    let requestPath;

    try {
        requestPath = decodeURIComponent(
            req.url.split("?")[0]
        );
    } catch (error) {

        res.writeHead(400, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end("400 - Bad Request");
        return;
    }

    if (requestPath === "/") {
        sendFile(
            res,
            path.join(PUBLIC_DIR, "index.html")
        );
        return;
    }

    // Try serving from public directory first
    let filePath = path.join(PUBLIC_DIR, requestPath);

    if (isSafePath(filePath, PUBLIC_DIR)) {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            sendFile(res, filePath);
            return;
        }
    }

    // Fallback to root directory (e.g. lab-01/lab1-output.png)
    filePath = path.join(ROOT_DIR, requestPath);

    if (isSafePath(filePath, ROOT_DIR)) {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            sendFile(res, filePath);
            return;
        }
    }

    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
    });
    res.end("404 - Page or File Not Found");
});

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

server.listen(PORT, () => {
    console.log("");
    console.log("==========================================");
    console.log("     NODE.JS LABORATORY PORTFOLIO");
    console.log("==========================================");
    console.log("");
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("");
});