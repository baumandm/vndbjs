var net = require('net');
var version = require('./package.json').version
var client = new net.Socket();

class Api {
    constructor(clientName) {
        this.clientName = clientName;
        startListeners();
        this.connected = false;
        this.logged = false;
    }

    query(message) {
        return new Promise( (resolve, reject) => {
            var chunk = "";
            client.on('data', (data) => {
                chunk += data.toString();
                if (data.indexOf("\x04") === -1) {
                    return;
                }
                let extracted = chunk.substring(0, chunk.indexOf("\x04"));
                chunk = "";
                if (extracted === "ok") {
                    console.log("Login Successful")
                    this.logged = true;
                } else {
                    let command = extracted.substring(0, extracted.indexOf(" "));
                    extracted = extracted.replace(`${command} `, "");
                    let output = JSON.parse(extracted).items;
                    console.log(output);
                    client.removeAllListeners('data');
                    return resolve(output)
                }
            });
            if (this.connected === false) {
                connect();
            }
            if (this.logged === false) {
                login();
            }
            client.write(`${message}\x04`);
        })
    }
}

function startListeners() {
    client.on('connect', () => {
        console.log('Connection successful');
        this.connected = true;
        client.setTimeout(60000)
        client.setEncoding("utf8");
    });

    client.on('error', (error) => {
        console.log(`ERROR: ${error}`);
        client.destroy();
    });

    client.on('close', () => {
        console.log("Connection closed.");
        this.connected = false;
        this.logged = false;
    });

    client.on('timeout', () => {
        this.connected = false;
        this.logged = false;
        client.destroy();
    });
}

function connect() {
    client.connect(19534, "api.vndb.org");
}

function login() {
    client.write(`login {"protocol":1,"client":"vndbjs","clientver":"${version}"}\x04`)
}

module.exports = Api;
