const fs = require("fs");
fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) {                 // HANDLE
    console.log(err.message);
    return;                  // STOP
  }
  console.log(data);
});