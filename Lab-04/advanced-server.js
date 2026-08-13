const http = require('http');
const url = require('url');

const students = [
    { id: 1, name: "Aditya", course: "MCA", marks: 72 },
    { id: 2, name: "Ayush", course: "BCA", marks: 85 },
    { id: 3, name: "Bhaskar", course: "BIT", marks: 58 },
    { id: 4, name: "Gouri", course: "BCA", marks: 91 },
    { id: 5, name: "Kanak", course: "BCA", marks: 64 },
    { id: 6, name: "Nisha", course: "BCA", marks: 78 },
    { id: 7, name: "Pragya", course: "BCA", marks: 88 },
    { id: 8, name: "reshabh", course: "BIT", marks: 45 },
    { id: 9, name: "Sayon", course: "BCA", marks: 69 },
    { id: 10, name: "Shreya S", course: "BCA", marks: 95 },
    { id: 11, name: "Sudhannshu", course: "BCA", marks: 52 },
    { id: 12, name: "Yadev", course: "MCA", marks: 73 },
    { id: 13, name: "Mikki", course: "BIT", marks: 61 },
    { id: 14, name: "Shreya KAshyap", course: "MCA", marks: 82 }
];

const server = http.createServer((req, res) => {

    res.setHeader('Content-Type', 'application/json');

    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathName === '/students' || pathName.startsWith('/students/course/')) {
        let result = students;

        // Course from route parameter
        if (pathName.startsWith('/students/course/')) {

            const courseFromPath = pathName.split('/')[3];

            result = result.filter(
                student =>
                    student.course.toLowerCase() ===
                    courseFromPath.toLowerCase()
            );
        }

        // Filter by course
        if (query.course) {
            result = result.filter(
                student =>
                    student.course.toLowerCase() ===
                    query.course.toLowerCase()
            );
        }

       // Filter by minimum marks
    if (query.minMarks) {

        const minMarks = Number(query.minMarks);

        if (isNaN(minMarks)) {

            res.writeHead(400);

            res.end(JSON.stringify({
                error: "minMarks must be a number"
            }));

            return;
        }

        result = result.filter(
            student => student.marks >= minMarks
            );
        }

        // Search by name
        if (query.search) {

        const searchText = query.search.toLowerCase();

        result = result.filter(
            student =>
                student.name.toLowerCase().includes(searchText)
            );
        }

        // Sorting
        if (query.sort) {

            if (query.sort !== 'name' && query.sort !== 'marks') {

                res.writeHead(400);

                res.end(JSON.stringify({
                    error: "sort must be either name or marks"
                }));

                return;
            }

            const order = query.order || 'asc';

            result = [...result].sort((a, b) => {

                let comparison;

                if (query.sort === 'name') {

                    comparison = a.name
                        .toLowerCase()
                        .localeCompare(b.name.toLowerCase());

                } else {

                    comparison = a.marks - b.marks;
                }

                if (order === 'desc') {
                    return -comparison;
                }

                return comparison;
            });
        }

        res.end(JSON.stringify(result));

    } else {

        res.writeHead(404);

        res.end(JSON.stringify({
            error: "Route not found"
        }));
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});