const http = require('http');

// STUDENT DATA

const students = [
    { id: 1, name: "Aditya", course: "BCA" },
    { id: 2, name: "Ayush", course: "BCA" },
    { id: 3, name: "Bhaskar", course: "BIT" },
    { id: 4, name: "Gouri", course: "BCA" },
    { id: 5, name: "Kanak", course: "BCA" },
    { id: 6, name: "Nisha", course: "BCA" },
    { id: 7, name: "Pragya", course: "BCA" },
    { id: 8, name: "reshabh", course: "BCA" },
    { id: 9, name: "Sayon", course: "BCA" },
    { id: 10, name: "Shreya S", course: "BCA" },
    { id: 11, name: "Sudhannshu", course: "BCA" },
    { id: 12, name: "Yadev", course: "BCA" },
    { id: 13, name: "Mikki", course: "BCA" },
    { id: 14, name: "Shreya KAshyap", course: "BCA" }
];

// BOOK DATA - TASK 3

const books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction"
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-help"
    },
    {
        id: 3,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        category: "Finance"
    },
    {
        id: 4,
        title: "Ikigai",
        author: "Hector Garcia",
        category: "Self-help"
    },
    {
        id: 5,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Finance"
    }
];

// CREATE SERVER

const server = http.createServer((req, res) => {

    // JSON response
    res.setHeader('Content-Type', 'application/json');

    // 1. GET ALL STUDENTS
    // /students

    if (req.url === '/students') {

        res.end(JSON.stringify(students));
    }

    // 2. FIND STUDENTS BY COURSE
    // /students/course/BCA

    else if (req.url.startsWith('/students/course/')) {

        const course = req.url.split('/')[3];

        const courseStudents = students.filter(
            student => student.course.toLowerCase() === course.toLowerCase()
        );

        if (courseStudents.length > 0) {

            res.end(JSON.stringify(courseStudents));

        } else {

            res.writeHead(404);

            res.end(JSON.stringify({
                error: "No students found for this course"
            }));
        }
    }

    // 3. FIND STUDENT BY NAME
    // /students/name/Pragya

    else if (req.url.startsWith('/students/name/')) {

        const name = req.url.split('/')[3];

        const student = students.find(
            student => student.name.toLowerCase() === name.toLowerCase()
        );

        if (student) {

            res.end(JSON.stringify(student));

        } else {

            res.writeHead(404);

            res.end(JSON.stringify({
                error: "Student not found"
            }));
        }
    }

    // 4. FIND STUDENT BY ID
    // /students/7

    else if (req.url.startsWith('/students/')) {

        const id = Number(req.url.split('/')[2]);

        // Check if ID is a number
        if (isNaN(id)) {

            res.writeHead(400);

            res.end(JSON.stringify({
                error: "Student ID must be a number"
            }));

            return;
        }

        const student = students.find(
            student => student.id === id
        );

        if (student) {

            res.end(JSON.stringify(student));

        } else {

            res.writeHead(404);

            res.end(JSON.stringify({
                error: "Student not found"
            }));
        }
    }

    // 5. GET ALL BOOKS
    // /items

    else if (req.url === '/items') {

        res.end(JSON.stringify(books));
    }

    // 6. FIND BOOK BY ID
    // /items/1

    else if (req.url.startsWith('/items/')) {

        const id = Number(req.url.split('/')[2]);

        // Check if ID is a number
        if (isNaN(id)) {

            res.writeHead(400);

            res.end(JSON.stringify({
                error: "Item ID must be a number"
            }));

            return;
        }

        const book = books.find(
            book => book.id === id
        );

        if (book) {

            res.end(JSON.stringify(book));

        } else {

            res.writeHead(404);

            res.end(JSON.stringify({
                error: "Item not found"
            }));
        }
    }

    // 7. ROUTE NOT FOUND

    else {

        res.writeHead(404);

        res.end(JSON.stringify({
            error: "Route not found"
        }));
    }
});

// START SERVER

server.listen(3000, () => {
    console.log("Server running on port 3000");
});