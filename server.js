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

    /*
    |--------------------------------------------------------------------------
    | HOME PAGE
    |--------------------------------------------------------------------------
    */

    if (requestPath === "/") {
        sendFile(
            res,
            path.join(PUBLIC_DIR, "index.html")
        );

        return;
    }

    /*
    |--------------------------------------------------------------------------
    | LAB-03 EXISTING SCREENSHOTS
    |--------------------------------------------------------------------------
    |
    | These files remain inside Lab-03.
    | They are served through the main portfolio server.
    |
    */

    const lab03Files = {
        "/lab-03/students-output.png":
            path.join(ROOT_DIR, "Lab-03", "students-output.png"),

        "/lab-03/items-output.png":
            path.join(ROOT_DIR, "Lab-03", "items-output.png")
    };

    if (lab03Files[requestPath]) {

        const filePath = lab03Files[requestPath];

        if (!isSafePath(filePath, ROOT_DIR)) {
            res.writeHead(403);
            res.end("403 - Forbidden");
            return;
        }

        sendFile(res, filePath);
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | LAB-01 / LAB-02 SCREENSHOTS
    |--------------------------------------------------------------------------
    |
    | If you later place screenshots inside those folders,
    | these routes can serve them without moving the files.
    |
    */

    const labFiles = {

        "/lab-01/lab1-output.png":
            path.join(ROOT_DIR, "Lab-01", "lab1-output.png"),

        "/lab-01/lab1-node-version.png":
            path.join(ROOT_DIR, "Lab-01", "lab1-node-version.png"),

        "/lab-02/lab2-output.png":
            path.join(ROOT_DIR, "Lab-02", "lab2-output.png")
    };

    if (labFiles[requestPath]) {

        const filePath = labFiles[requestPath];

        if (!isSafePath(filePath, ROOT_DIR)) {
            res.writeHead(403);
            res.end("403 - Forbidden");
            return;
        }

        sendFile(res, filePath);
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | PUBLIC FILES
    |--------------------------------------------------------------------------
    */

    let requestedFile = requestPath;

    if (requestedFile === "/index.html") {
        requestedFile = "/index.html";
    }

    const filePath = path.join(
        PUBLIC_DIR,
        requestedFile
    );

    if (!isSafePath(filePath, PUBLIC_DIR)) {

        res.writeHead(403, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end("403 - Forbidden");
        return;
    }

    fs.stat(filePath, (error, stats) => {

        if (error || !stats.isFile()) {

            res.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });

            res.end("404 - Page or File Not Found");
            return;
        }

        sendFile(res, filePath);
    });
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