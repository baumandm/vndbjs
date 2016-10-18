var net = require('net');
var client = new net.Socket();
var version = require('./package.json').version
var connected = false;
var logged = false;

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
    connected = false;
    logged = false;
});

client.on('timeout', () => {
    connected = false;
    logged = false;
    client.destroy();
});

module.exports = {
    query: (request) => {
        return sendMessage(request);
    }
}

function sendMessage(message) {
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
                logged = true;
            } else {
                let command = extracted.substring(0, extracted.indexOf(" "));
                extracted = extracted.replace(`${command} `, "");
                output = JSON.parse(extracted).items;
                console.log(output);
                client.removeAllListeners('data');
                return resolve(output)
            }
        });
        if (connected === false) {
            connect();
        }
        if (logged === false) {
            login();
        }

        client.write(`${message}\x04`);
    })
}

function connect() {
    client.connect(19534, "api.vndb.org");
}

function login() {
    client.write(`login {"protocol":1,"client":"vndbjs","clientver":"${version}"}\x04`)
}
