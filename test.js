var vndb = require('./index.js');

vndb.searchVN('Muv-Luv').then((output) => {
    console.log(`Top result: ${JSON.stringify(output[0])}`)
}), (reject) => {
    console.log('Error');
};
