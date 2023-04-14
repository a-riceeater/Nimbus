/*//const { ipcRenderer } = require('electron');
const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
const { WebLinksAddon } = require('xterm-addon-web-links');
const os = require('os');

var term = new Terminal({
    cursorBlink: true,
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 1.4,
    scrollback: 1000,
});
term.open(document.getElementById('terminal'));
term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')


term.loadAddon(new WebLinksAddon());


ipcRenderer.on("terminal.incomingData", (event, data) => {
    console.log("INCOMMING:")
    console.dir(data);
    term.write(data);
});

term.onData(e => {
    console.dir(e)
    ipcRenderer.send("terminal.keystroke", e);
});*/

var term = new Terminal({ cursorBlink: true });
term.open(document.getElementById('terminal'));
term.write("Welcome to Nimbus Terminal. Press enter to begin.\n\r")

ipcRenderer.on("terminal.incomingData", (event, data) => {
    term.write(data);
});

term.onData(e => {
    console.log("keystroke:")
    console.dir(e)
    ipcRenderer.send("terminal.keystroke", e);
});
