const http = require('http');               //Imports Node.js's built-in HTTP module

function handler(req, res) {
    res.writeHead(200, {                //It sends the HTTP status code and headers.
        'Content-Type': 'text/plain'
    });
    res.end('Hello World, from NodeJS!');   //finishes the response and sends data to the browser.
}

module.exports = handler; // line 1: export it

if (require.main === module) { // line 2: start only when run directly
    const PORT = process.env.PORT || 3000;
    http.createServer(handler).listen(PORT, () => {
        console.log(`Lab 01 running on ${PORT}`);
    });
}