const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

function setHeaders(req, res, next){
    // res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers', 'Content-Type, token, Content-Length, X-Requested-With, *');
    // res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();  
}

module.exports = {
    setHeaders
};