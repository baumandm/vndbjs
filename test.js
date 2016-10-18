var vndb = require('./index.js');

vndb.query(`get vn basic,details,stats (title = "Muv-Luv")`).then( (output) => {
    console.log(output);
});
