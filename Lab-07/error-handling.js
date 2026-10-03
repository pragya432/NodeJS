const EventEmitter = require('events');

const risky = new EventEmitter();

risky.emit(
    'error',
    new Error('Something broke')
);