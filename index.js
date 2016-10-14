var net = require('net');
var client = new net.Socket();
var version = require('./package.json').version
var connected = false;
var logged = false;

function getVN (title) {
    if (connected === false) {
        connect();
    }
    if (logged === false) {
        login();
    }
    sendMessage(`get vn basic (search ~ "muv luv")`);
}

getVN("Muv-Luv");

client.on('connect', () => {
    console.log('Connection successful');
    connected = true;
    client.setTimeout(60000)
})

var responses = "";
client.on('data', (data) => {
    responses += data.toString();
    console.log(`DATA: ${responses}`);
    let first = responses.substring(0, responses.indexOf("\x04"));
    console.log(first);
});

client.on('error', (error) => {
    console.log(`ERROR: ${error}`);
    client.destroy();
})

client.on('close', () => {
    console.log("Connection closed.");
});

client.on('timeout', () => {
    connected = false;
    client.destroy();
})

function sendMessage(message) {
    client.write(`${message}\x04`);
}

function connect() {
    client.connect(19534, "api.vndb.org", () => {
        console.log('Attempting connection to VNDB');
    });
}

function login() {
    sendMessage(`login {"protocol":1,"client":"vndbnodejslib","clientver":"${version}"}`)
}
