module.exports = [
  {
    id: '01',
    title: 'Simple HTTP Server',
    topic: 'http module, routing',
    type: 'server',
    file: '../Lab-01/server.js',
    try: '/'
  },
  {
    id: '02',
    title: 'Student Directory & Profile API',
    topic: 'JSON, query parameters, HTTP routing',
    type: 'server',
    file: '../Lab-02/server.js',
    try: '/students?course=BCA'
  },
  {
    id: '03',
    title: 'Student Directory API',
    topic: 'RESTful routing, array methods, find/filter',
    type: 'server',
    file: '../Lab-03/students-server.js',
    try: '/students'
  },
  {
    id: '04',
    title: 'Advanced Search Filter and Sort API',
    topic: 'Query parameters, multi-field filtering, sorting',
    type: 'server',
    file: '../Lab-04/advanced-server.js',
    try: '/students?course=BCA&minMarks=80'
  },
  {
    id: '05',
    title: 'Async JS Food Delivery Tracker',
    topic: 'Promises, async/await, Event Loop',
    type: 'script',
    file: '../Lab-05/async-await-version.js'
  },
  {
    id: '06',
    title: 'File System Module (fs)',
    topic: 'fs module, async reading and writing',
    type: 'script',
    file: '../Lab-06/read-async.js'
  },
  {
    id: '07',
    title: 'EventEmitter & Event-Driven Architecture',
    topic: 'events module, EventEmitter, custom events',
    type: 'script',
    file: '../Lab-07/order-tracker.js'
  }
];
