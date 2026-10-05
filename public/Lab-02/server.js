const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end(
            'Welcome to my Node.js Server!\n' +
            'Name: Pragya Gupta\n' +
            'Scholar Number: 23145013\n' +
            'Course: BCA'
        );
    }

    else if (req.url === '/about' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end(
            'About Me\n' +
            'My name is Pragya Gupta. I am a BCA student learning Node.js.'
        );
    }

    else if (req.url === '/college' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end(
            'College: Dev Sanskriti Vishwavidyalaya\n' +
            'Semester: VII'
        );
    }

    else if (req.url === '/profile' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        const profile = {
            name: 'Pragya Gupta',
            scholarNumber: '23145013',
            course: 'BCA',
            semester: 'VII',
            college: 'Dev Sanskriti Vishwavidyalaya'
        };

        res.end(JSON.stringify(profile));
    }

    else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        res.end('Page Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});