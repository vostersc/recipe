const {pool, getAllUserInfo} = require('./src/database');

(async function(){
    try {
        console.log('migrations.js: 4 --->', process.env.NODE_ENV); 



///// RUN MIGRATION /////
        // const result = await pool.query('ALTER TABLE users ADD "courses" jsonb NULL;');
        // console.log('MIGRATION RESULT -------> ', result);



///// TEST MIGRATION /////
        // const r = await getAllUserInfo();
        // console.log('migrations.js: 16 --->', r.rows);



    } catch(err){
        console.log('migrations.js: 12 --->', err);
    }
})();