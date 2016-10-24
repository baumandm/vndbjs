var net = require('net');
var emitter = require('events');
var status = new emitter();
var version = require('./package.json').version
var client = new net.Socket();

class Api {
    constructor(clientName) {
        this.clientName = clientName;
        startListeners();
        this.connected = false;
        this.logged = false;
        loginListener();
    }

    get(args) {
        var message = parseArgs(args);
        return this.query(`get ${message}`);

    }

    query(message) {
        return new Promise( (resolve, reject) => {
            if (message === false) {
                return reject("Invalid query.")
            }
            status.emit('login')
            status.on('ready', () => {
                client.on('error', (error) => {
                    console.log(`ERROR: ${error}`);
                });
                var chunk = "";
                client.on('data', (data) => {
                    chunk += data.toString();
                    if (data.indexOf("\x04") === -1) {
                        return;
                    }
                    let response = chunk.substring(0, chunk.indexOf("\x04"));
                    chunk = chunk.replace(`${response}\x04`, "")
                    let command = response.substring(0, response.indexOf(" "));
                    let json = response.replace(`${command} `, "");
                    let output = JSON.parse(json);
                    client.removeAllListeners('data');
                    if (command === "error") {
                        return reject(`${command}: ${output.msg}`)
                    } else if (command === "results" || command === "dbstats") {
                        return resolve(output)
                    }
                });
                client.write(`${message}\x04`);
            })
        })
    }
}

function loginListener() {
    status.once('login', () => {
        connect().then( (result) => {
            login().then( (result) => {
                status.emit('ready');
            }, (reject) => {
                console.log("Login failed.")
            })
        }, (reject) => {
            console.log("Connection failed.")
        })
    })
}

function startListeners() {
    client.on('close', () => {
        console.log("Connection closed.");
        this.connected = false;
        this.logged = false;
        loginListener();
    });

    client.on('timeout', () => {
        this.connected = false;
        this.logged = false;
        client.destroy();
    });
}

function parseArgs(args) {
    var type = args.hasOwnProperty("type") ? args.type : false
    var flags = args.hasOwnProperty("flags") ? args.flags : ["basic", "details", "stats"];
    var filter = args.hasOwnProperty("filter") ? args.filter : false;
    if (type === false || filter === false) { return false};
    return `${args.type} ${flags.join(',')} (${filter.type} ${filter.oper} ${filter.value})`
}

function connect() {
    return new Promise( (resolve, reject) => {
        client.on('error', (error) => {
            console.log(`ERROR: ${error}`);
            return reject();
        });
        client.on('connect', () => {
            console.log("connection successful");
            this.connected = true;
            client.setTimeout(60000)
            client.setEncoding("utf8");
            client.removeAllListeners('error');
            client.removeAllListeners('connect');
            return resolve();
        })
        client.connect(19534, "api.vndb.org");
    })
}

function login() {
    return new Promise( (resolve, reject) => {
        client.on('error', (error) => {
            console.log(`ERROR: ${error}`);
        });
        client.on('data', (data) => {
            let chunk = "";
            chunk += data.toString();
            let response = chunk.substring(0, chunk.indexOf("\x04"));
            if (response === "ok") {
                console.log("Logged in to VNDB")
            }
            client.removeAllListeners('error');
            client.removeAllListeners('data');
            return resolve();
        })
        client.write(`login {"protocol":1,"client":"${this.clientName}","clientver":"${version}"}\x04`)
    })
}


module.exports = Api;
