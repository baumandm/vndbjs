const net = require('net');
const version = require('../package.json').version;

class Courier extends net.Socket {

  /**
  * Manages an individual connections functionality.
  * @constructor
  */
  constructor() {
    super();
    this.end = '\x04';
  }

  /**
  * Establishes a connection with the vndb server.
  * Resolves once the server is connected.
  * @param {string} - The remote URI to connect to.
  * @param {number} - The port number of the connection.
  * @param {string} - The encoding setting.
  * @returns {Promise}
  */
  makeConnection(uri, port, encoding) {
    return new Promise((resolve, reject) => {
      this.once('error', () => reject());
      this.on('connect', () => {
        this.setEncoding(encoding);
        this.removeAllListeners('error');
        this.removeAllListeners('connect');
        resolve();
      });
      this.connect(port, uri);
    });
  }

  /**
  * Logs into the vndb server.
  * Resolves once the server authorizes connection.
  * @param {string} - A UUID for this particular connection, used to log in.
  * @returns {Promise}
  */
  login(clientName) {
    return new Promise((resolve, reject) => {
      this.once('error', error => reject(error));
      this.on('data', (data) => {
        let chunk = '';
        chunk += data.toString();
        const response = chunk.substring(0, chunk.indexOf(this.end));
        if (response === 'ok') {
          this.removeAllListeners('error');
          this.removeAllListeners('data');
          resolve();
        }
      });
      this.send(`login {"protocol":1,"client":"${clientName}","clientver":"${version}"}`);
    });
  }

  /**
  * A utility function, appends the ending code.
  * @param {string} - The content of the message
  */
  send(contents) {
    this.write(`${contents}${this.end}`);
  }

  /**
  * Sends a message and collects the response.
  * Resolves once the message has been recieved and parsed.
  * @param {string} - The message to be sent to the server.
  * @returns {Promise<Object>}
  */
  awaitResponse(message) {
    return new Promise((resolve, reject) => {
      let chunk = '';
      this.on('data', (data) => {
        chunk += data.toString();
        if (data.indexOf(this.end) === -1) return;
        this.removeAllListeners('data');
        const response = this.splitResponse(chunk);
        if (response.head === 'error') reject(response);
        resolve(response);
      });
      this.send(message);
    });
  }

  /**
  * Parses a response string into a header and body.
  * @param {string} - The response to be parsed.
  * @returns {Object}
  */
  splitResponse(response) {
    const parts = {};
    const space = response.indexOf(' ');
    parts.head = response.substring(0, space);
    parts.body = JSON.parse(response.substring(space + 1, response.indexOf(this.end)));
    return parts;
  }
}

module.exports = Courier;
