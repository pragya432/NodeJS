const http = require('http');

// Student data
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

// Book data for Task 3
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

// Create server
const server = http.createServer((req, res) => {

    // Set response type
    res.setHeader('Content-Type', 'application/json');

    // =========================
    // TASK 2 - ALL STUDENTS
    // =========================

    if (req.url === '/students') {

        res.end(JSON.stringify(students));
    }

    // =========================
    // TASK 4 - STUDENTS BY COURSE
    // =========================

    else if (req.url === '/students/course/BCA') {

        const bcaStudents = students.filter(
            student => student.course === 'BCA'
        );

        res.end(JSON.stringify(bcaStudents));
    }

    // =========================
    // TASK 2 & 4 - STUDENT BY ID
    // =========================

    else if (req.url.startsWith('/students/')) {

        // Extract ID from URL
        const id = Number(req.url.split('/')[2]);

        // Check for non-numeric ID
        if (isNaN(id)) {

            res.writeHead(400);

            res.end(JSON.stringify({
                error: "Student ID must be a number"
            }));

            return;
        }

        // Find student
        const student = students.find(
            student => student.id === id
        );

        // Student found
        if (student) {

            res.end(JSON.stringify(student));

        }

        // Student not found
        else {

            res.writeHead(404);

            res.end(JSON.stringify({
                error: "Student not found"
            }));
        }
    }

    // =========================
    // TASK 3 - ALL ITEMS
    // =========================

    else if (req.url === '/items') {

        res.end(JSON.stringify(books));
    }

    // =========================
    // TASK 3 - ITEM BY ID
    // =========================

    else if (req.url.startsWith('/items/')) {

        // Extract ID from URL
        const id = Number(req.url.split('/')[2]);

        // Check for non-numeric ID
        if (isNaN(id)) {

            res.writeHead(400);

            res.end(JSON.stringify({
                error: "Item ID must be a number"
            }));

            return;
        }

        // Find book
        const book = books.find(
            book => book.id === id
        );

        // Book found
        if (book) {

            res.end(JSON.stringify(book));

        }

        // Book not found
        else {

            res.writeHead(404);

            res.end(JSON.stringify({
                error: "Item not found"
            }));
        }
    }

    // ROUTE NOT FOUND

    else {

        res.writeHead(404);

        res.end(JSON.stringify({
            error: "Route not found"
        }));
    }
});

// Start server
server.listen(3000, () => {
    console.log("Server running on port 3000");
});