const EventEmitter = require('events');

const app = new EventEmitter();

// This should execute only once
app.once('firstLogin', (user) => {
    console.log(`Welcome bonus applied for ${user}!`);
});

// This executes every time
app.on('login', (user) => {
    console.log(`${user} logged in.`);
});

// First login
app.emit('firstLogin', 'Aman');
app.emit('login', 'Aman');

// Second login
app.emit('firstLogin', 'Aman');
app.emit('login', 'Aman');

// Third login
app.emit('firstLogin', 'Aman');
app.emit('login', 'Aman');