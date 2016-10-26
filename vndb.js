var net = require('net');
var version = require('./package.json').version;
var shortid = require('shortid');
var Pool = require('generic-pool').Pool;

class Api {

    constructor(clientName) {
        this.clientName = clientName;
        this.pool = new Pool({
            name     : "vndb",
            create   : function(callback) {
                var client = new net.Socket();
                connect(client).then( () => {
                    login(client).then( () => {
                        callback(null, client);
                    }, (err) => {
                        console.log("Login failed" + err);
                    })
                }, (err) => {
                    console.log("Connection Failed" + err);
                })
            },
            destroy  : function(client) { client.destroy(); },
            max      : 10,
            min      : 2,
            idleTimeoutMillis : 30000,
            log : false
        });
    }
    // returns database stats
    stats() {
        return this.query('dbstats');
    }
    // returns top 10 results for the title query, basic data only
    searchVnList(title) {
        return this.query(`get vn basic (search ~ "${title}")`)
    }
    // returns all data on title query.  Must be *exact* match.
    getVnByTitleFull(exactTitle) {
        return this.query(`get vn basic,details,stats,anime,relations,tags,screens (title = "${exactTitle}")`)
    }
    // returns moderate data on title query.  Must be *exact* match.
    getVnByTitle(exactTitle) {
        return this.query(`get vn basic,details,stats (title = "${exactTitle}")`)
    }
    // returns all data on id query.
    getVnByIdFull(id) {
        return this.query(`get vn basic,details,stats,anime,relations,tags,screens (id = ${id})`)
    }
    // returns moderate data on id query.
    getVnById(id) {
        return this.query(`get vn basic,details,stats (id = ${id})`)
    }

    get(args) {
        var message = parseArgs(args);
        return this.query(`get ${message}`);
    }

    query(message) {
        return new Promise( (resolve, reject) => {
            this.pool.acquire( (err, client) => {
                if (err) {
                    console.log(`ERROR: ${err}`);
                }
                else {
                    var chunk = "";
                    client.on('data', (data) => {
                        chunk += data.toString();
                        if (data.indexOf("\x04") === -1) {
                            return;
                        }
                        let response = chunk.substring(0, chunk.indexOf("\x04"));
                        chunk = chunk.replace(`${response}\x04`, "");
                        let command = response.substring(0, response.indexOf(" "));
                        let json = response.replace(`${command} `, "");
                        let output = JSON.parse(json);
                        client.removeAllListeners('data');
                        if (command === "error") {
                            this.pool.release(client);
                            return reject(response);
                        } else if (command === "results" || command === "dbstats") {
                            this.pool.release(client);
                            return resolve(output);
                        }
                    });
                    client.write(`${message}\x04`);
                }
            });
        });
    }
}

function parseArgs(args) {
    var type = args.prototype.hasOwnProperty("type") ? args.type : false;
    var flags = args.prototype.hasOwnProperty("flags") ? args.flags : ["basic", "details", "stats"];
    var filter = args.prototype.hasOwnProperty("filter") ? args.filter : false;
    if (type === false || filter === false) { return false}
    return `${args.type} ${flags.join(',')} (${filter.type} ${filter.oper} ${filter.value})`
}

function login(client) {
    return new Promise( (resolve, reject) => {
        client.on('error', (error) => {
            console.log(`ERROR: ${error}`);
        });
        client.on('data', (data) => {
            let chunk = "";
            chunk += data.toString();
            let response = chunk.substring(0, chunk.indexOf("\x04"));
            if (response === "ok") {
                //console.log("Logged in to VNDB")
            }
            client.removeAllListeners('error');
            client.removeAllListeners('data');
            return resolve();
        });
        client.write(`login {"protocol":1,"client":"${this.clientName}-${shortid.generate()}","clientver":"${version}"}\x04`)
    });
}

function connect(client) {
    return new Promise( (resolve, reject) => {
        client.on('error', (error) => {
            console.log(`ERROR: ${error}`);
            return reject();
        });
        client.on('connect', () => {
            //console.log("connection successful");
            client.setEncoding("utf8");
            client.removeAllListeners('error');
            client.removeAllListeners('connect');
            return resolve();
        });
        client.connect(19534, "api.vndb.org");
    });
}

module.exports = Api;
