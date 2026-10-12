const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOGS_DIR, 'server.log');

// Create the logs folder automatically
try {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
} catch (err) {
    console.error('Failed to create logs directory:', err.message);
}

class Logger extends EventEmitter {
    constructor() {
        super();

        // Listen for the event 'request' with (method, url)
        this.on('request', (method, url) => {
            const timestamp = new Date().toISOString();
            const logLine = `${timestamp} ${method} ${url}\n`;

            // Print the line in console
            console.log(logLine.trim());

            // Append it to logs/server.log using fs.appendFile
            fs.appendFile(LOG_FILE, logLine, (err) => {
                if (err) {
                    this.emit('error', err);
                }
            });
        });

        // Add a listener for 'error' so a logging problem never crashes the server
        this.on('error', (err) => {
            console.error('Logger error:', err.message);
        });
    }
}

// Export one instance of it and the LOG_FILE path
const logger = new Logger();

module.exports = {
    logger,
    LOG_FILE
};
