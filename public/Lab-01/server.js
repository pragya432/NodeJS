const http = require('http');               //Imports Node.js's built-in HTTP module

const server  = http.createServer(          //creates a new HTTP server; "Create a server that will listen for requests."
    (req, res) => {
        res.writeHead(200, {                //It sends the HTTP status code and headers.
            'Content-Type': 'text/plain'
        });
        res.end('Hello World, from NodeJS!');   //finishes the response and sends data to the browser.
    }
);                                              //the server has been created, but it is not yet listening for requests.

server.listen(3000, () => {                     //This tells the server to start listening on port 3000.
    console.log('Server running...hehehehehahahahehehehhahahahahehehehehehahahahahaaaaaaaaaaaaaaaaaaaaaaa');
});