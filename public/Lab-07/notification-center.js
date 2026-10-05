const EventEmitter = require('events');

const risky = new EventEmitter();


// Error listener
risky.on('error', (err) => {
    console.log(`Handled gracefully: ${err.message}`);
});


// Trigger error
risky.emit('error', new Error('Something broke')
);

console.log('Program continues running.');