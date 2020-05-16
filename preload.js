// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const fs = require('fs');
window.keyConfig = JSON.parse(fs.readFileSync('config.json')).key;
