const tls = require('tls');
const GenericConnection = require('./GenericConnection.js');
/**
* Represents a TLS-secure socket connection
* @class
* @extends GenericConnection
* @prop {string} uri The host uri of VNDB
* @prop {number} port The host port of VNDB
* @prop {string} eol The end-of-line character `\x04`
* @prop {tls.TLSSocket} socket A secure TLS Socket
**/
class SecureConnection extends GenericConnection {
  /**
  * A secure connection
  * @constructor
  **/
  constructor() {
    super();
    this.port = 19535;
  }

  /**
  * Establishes a secure connection with VNDB
  * @param {string} encoding A string representing the encoding to use
  * @returns {Promise<string>}
  **/
  connect(encoding) {
    return new Promise((resolve, reject) => {
      this.socket = tls.connect({
        host: this.uri,
        port: this.port,
        rejectUnauthorized: true
      }, () => {
        if (this.socket.authorized) {
          this.socket.setEncoding(encoding);
          resolve('ok');
        } else {
          reject(new Error('error'));
        }
      });
    });
  }

  /**
  * Destroys the secure socket connection
  * @returns {Promise}
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

module.exports = SecureConnection;
