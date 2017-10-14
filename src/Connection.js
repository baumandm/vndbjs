const net = require('net');
const GenericConnection = require('./GenericConnection.js');

/**
* Represents an insecure socket connection
* @class
* @extends GenericConnection
* @prop {string} uri The host uri of VNDB
* @prop {number} port The host plain TCP port of VNDB
* @prop {string} eol The end-of-line character `\x04`
* @prop {net.Socket} socket A net Socket
**/
class Connection extends GenericConnection {
  /**
  * An insecure connection
  * @constructor
  **/
  constructor() {
    super();
    this.port = 19534;
    this.socket = new net.Socket();
  }

  /**
  * Establishes a connection with VNDB
  * @param {string} encoding A string representing the encoding to use
  * @returns {Promise<string>} Resolves when the connection is established
  **/
  connect(encoding) {
    return new Promise((resolve, reject) => {
      this.socket.once('error', () => reject(new Error('error')));
      this.socket.on('connect', () => {
        this.socket.setEncoding(encoding);
        this.socket.removeAllListeners('error');
        this.socket.removeAllListeners('connect');
        resolve('ok');
      });
      this.socket.connect(this.port, this.uri);
    });
  }

  /**
  * Destroys the socket connection
  * @returns {Promise} Resolves when the socket is destroyed
  **/
  end() {
    return new Promise((resolve) => {
      this.socket.on('end', () => {
        resolve();
      });
      this.socket.end();
    });
  }
}

module.exports = Connection;
