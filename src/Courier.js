const net = require('net');
const version = require('../package.json').version;

class Courier extends net.Socket {

  /**
  * Manages an individual connections functionality
  * @class
  * @extends net.Socket
  * @see {@link https://nodejs.org/api/net.html#net_class_net_socket|net.Socket}
  */
  constructor() {
    super();

    /**
    * The end-of-line character
    * @type {string}
    */
    this.eol = '\x04';
  }

  /**
  * Sends a message and collects the response
  * Resolves once the message has been recieved and parsed
  * @param {string} - The message to be sent to the server
  * @returns {Promise<Object>}
  */
  awaitResponse(message) {
    return new Promise((resolve, reject) => {
      let chunk = '';
      this.on('data', (data) => {
        chunk += data.toString();
        if (data.indexOf(this.eol) === -1) return;
        this.removeAllListeners('data');
        const response = this.splitResponse(chunk);
        if (response.head === 'error') reject(response);
        resolve(response);
      });
      this.send(message);
    });
  }

  /**
  * Establishes a connection with the vndb server
  * Resolves once the server is connected
  * @param {string} - The remote URI to connect to
  * @param {number} - The port number of the connection
  * @param {string} - The encoding setting
  * @returns {Promise}
  */
  contact(uri, port, encoding) {
    return new Promise((resolve, reject) => {
      this.once('error', () => reject('vndbjs: connection failed'));
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
  * Registers client name with vndb.org
  * Resolves once the server authorizes connection
  * @param {string} - A UUID for this particular connection, used to log in
  * @returns {Promise}
  */
  register(clientName) {
    return new Promise((resolve, reject) => {
      this.once('error', error => reject(error));
      let chunk = '';
      this.on('data', (data) => {
        chunk += data.toString();
        const response = chunk.substring(0, chunk.indexOf(this.eol));
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
  * A utility function, appends the ending code
  * @param {string} - The content of the message
  */
  send(contents) {
    this.write(`${contents}${this.eol}`);
  }

  /**
  * Parses a response string into a header and body
  * @param {string} - The response to be parsed
  * @returns {Object}
  */
  splitResponse(response) {
    const parts = {};
    const space = response.indexOf(' ');
    parts.head = response.substring(0, space);
    parts.body = JSON.parse(response.substring(space + 1, response.indexOf(this.eol)));
    return parts;
  }
}

module.exports = Courier;
