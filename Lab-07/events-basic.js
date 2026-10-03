
const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.emit('greet', 'Pragyaaa');

emitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});

emitter.emit('greet', 'Pragyaaa');