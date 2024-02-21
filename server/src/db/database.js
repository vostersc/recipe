const fs = require('fs');
const pg = require('pg');
const path = require('path');

require('pg-essential').patch(pg);
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

let config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};


const isProd = !process.env.NODE_ENV?.includes('dev');
console.log('isProd', isProd);
if(isProd){
    const pathToCert = `${__dirname}/ca-certificate.cer`;
    const ca = fs.readFileSync(pathToCert).toString();
    const ssl = { rejectUnauthorized : false, ca };
    config = {...config, ssl};
}

function pool(){
    const pool = new pg.Pool(config);
    // pool.connect();

    pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        process.exit(-1)
    })

    return pool;
}

function client(){
    const client = new pg.Client(config);
    // client.connect();

    client.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        process.exit(-1);
    })

    return client;
}


async function loopQuery(dbConnection, query, valuesArray){ //values array = [[things to insert], [thing to insert]]
    let data = [];
    for(let i = 0; i < valuesArray.length; i++){
        if(!Array.isArray(valuesArray[i])) continue;
        const {rows} = await dbConnection.query(query, valuesArray[i]);
        if(rows?.length < 1) continue;
        
        data = [...data, rows];
    } 

    return data;
}

async function optimizedLoopQuery(dbConnection, query, valuesArray){
    let promises = [];
    for(let i = 0; i < valuesArray.length; i++){
        if(!Array.isArray(valuesArray[i])) continue;
        promises = [...promises, await dbConnection.query(query, valuesArray[i])];
    } 

    const results = await Promise.all(promises);
    const data = results.map(r => r.rows);

    return data;
}


module.exports = { pool, client, loopQuery, optimizedLoopQuery };


/////////////////////////////////////usage
// pool().query('some sql query');
// client().query('some sql query');