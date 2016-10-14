var net = require('net');
var client = new net.Socket();
var version = require('./package.json').version
var connected = false;
var logged = false;

module.exports = {
    searchVN: (title) => {
        return new Promise( (resolve, reject) => {
            createListeners();
            if (connected === false) {
                connect();
            }
            if (logged === false) {
                login();
            }
            var chunk = "";
            client.on('data', (data) => {
                chunk += data.toString();
                let extracted = chunk.substring(0, chunk.indexOf("\x04"));
                chunk = chunk.replace(`${extracted}\x04`, ""); //remove extracted string from chunk
                if (extracted === "ok") {
                    console.log("Login Successful")
                } else {
                    let command = extracted.substring(0, extracted.indexOf(" "));
                    extracted = extracted.replace(`${command} `, "");
                    output = JSON.parse(extracted).items;
                    console.log(output);
                    client.removeAllListeners('data');
                    return resolve(output)
                }
            });
            sendMessage(`get vn basic (search ~ "${title}")`);
        })
    }
}

function createListeners() {
    client.on('connect', () => {
        console.log('Connection successful');
        connected = true;
        client.setTimeout(60000)
        client.setEncoding("utf8");
    })

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
}

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
