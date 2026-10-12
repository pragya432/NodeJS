const http = require('http');

const url = require('url');

const PORT = process.env.PORT || 3000;

function handler(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === '/' && req.method === 'GET') {
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

    else if (pathname === '/about' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end(
            'About Me\n' +
            'My name is Pragya Gupta. I am a BCA student learning Node.js.'
        );
    }

    else if (pathname === '/college' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end(
            'College: Dev Sanskriti Vishwavidyalaya\n' +
            'Semester: VII'
        );
    }

    else if (pathname === '/profile' && req.method === 'GET') {
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

    else if (pathname === '/students' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        const students = [
            { id: 1, name: "Aditya", course: "BCA" },
            { id: 2, name: "Ayush", course: "BCA" },
            { id: 3, name: "Bhaskar", course: "BIT" },
            { id: 4, name: "Gouri", course: "BCA" },
            { id: 5, name: "Kanak", course: "BCA" },
            { id: 6, name: "Nisha", course: "BCA" },
            { id: 7, name: "Pragya", course: "BCA" }
        ];

        let result = students;
        if (query.course) {
            result = result.filter(
                student => student.course.toLowerCase() === query.course.toLowerCase()
            );
        }

        res.end(JSON.stringify(result));
    }

    else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        res.end('Page Not Found');
    }
}

module.exports = handler; // line 1: export it

if (require.main === module) { // line 2: start only when run directly
    http.createServer(handler).listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}