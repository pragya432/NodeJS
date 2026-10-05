## Lab 03 – Student Directory API

### Routes

- `/students` – Returns the complete list of students.
- `/students/:id` – Returns a specific student based on ID.
- `/students/course/BCA` – Returns only students enrolled in BCA.
- `/students/abc` – Handles a non-numeric student ID.
- `/items` – Returns the complete list of books.
- `/items/:id` – Returns a specific book based on ID.
- `/items/abc` – Handles a non-numeric item ID.

### req.url.split()

`req.url.split('/')` breaks the URL into parts separated by `/`, allowing the program to extract the ID from the URL.

### Array Methods Used

- `find()` is used to find one student or book by ID.
- `filter()` is used to find all students belonging to the BCA course.