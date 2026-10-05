const EventEmitter = require('events');

class NotificationCenter extends EventEmitter {}

const notifier = new NotificationCenter();


// Notification listener
notifier.on('newMessage', (from, text) => {
    console.log(`From ${from}: ${text}`);
});


// Error listener
notifier.on('error', (err) => {
    console.log(`Handled: ${err.message}`);
});


// Emit notification
notifier.emit(
    'newMessage',
    'Priya',
    'You free?'
);


// Add another event of your own
notifier.on('userOnline', (user) => {
    console.log(`${user} is now online.`);
});


// Trigger your own event
notifier.emit(
    'userOnline',
    'Aman'
);