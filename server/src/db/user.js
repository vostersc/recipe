const {pool} = require('./database');
const {hashPw} = require('../auth');
const moment = require('moment');

async function addNewUserToDb(userName, password, name){
    const dbPassword = await hashPw(password);
    const dbConnection = pool();

    const result = await dbConnection.query('insert into users (email, isfirsttime, password, name) values ($1, $2, $3, $4)', [userName, true, dbPassword, name]);
    dbConnection.end();

    return result;
}

async function setUserAsFinanciallyDelinquent(id){
    const dbConnection = pool();

    const result = await dbConnection.query('update users set iscurrent = false where id = $1', [id]);
    dbConnection.end();

    return result; 
}

async function replaceCourseIds(id, courseIdsArr){
    const courses = JSON.stringify(courseIdsArr);
    const dbConnection = pool();

    const result = await dbConnection.query('update users set courses = $1 where id = $2', [courses, id]);
    dbConnection.end();

    return result;
}

async function getSubscribedCourses(id){
    const dbConnection = pool();
    const result = await dbConnection.query('select courses from users where id = $1', [id]);

    return result?.rows[0].courses;
}

async function getAllUserInfo(id){
    const dbConnection = pool();

    if(!id){
        const result = await dbConnection.query('select * from users');
        dbConnection.end();

        return result;
    }

    const result = await dbConnection.query('select * from users where id=$1', [id]);
    dbConnection.end();

    return result?.rows;
}

async function getUserByEmail(email){
    if(!email) return;

    const dbConnection = pool();

    const result = await dbConnection.query('select * from users where email = $1', [email]);
    dbConnection.end();

    return result;
}

async function checkResetPasswordAttempts(email){
    try {
        const dbConnection = pool();

        const userIdResult = await dbConnection.query('select id from users where email = $1', [email]);
        if(!userIdResult?.rows[0]?.id) return;

        const result = await dbConnection.query('select * from attempts where userid = $1 and type = \'reset\' order by date asc limit 5;', [userIdResult.rows[0].id]);
        dbConnection.end();
    
        return result;
    } catch(err){
        console.log('user.js: 71 --->', err);
        return;
    }

}

async function updateResetPasswordAttempts(email){
    try {
        const dbConnection = pool();

        const now = moment().utc();
        const userIdResult = await dbConnection.query('select id from users where email = $1', [email]);
        if(!userIdResult?.rows[0]?.id) return;

        const result = await dbConnection.query('insert into attempts (date, userid, type) values ($1, $2, $3);', [now, userIdResult.rows[0].id, 'reset']);
        dbConnection.end();

        return result;
    } catch (err){
        console.log('user.js: 78 --->', err);
    }

}

async function reactivateUser(email){
    const dbConnection = pool();

    const result = await dbConnection.query('update users set iscurrent = true where email = $1', [email]);
    dbConnection.end();

    return result;
}

async function updateUserPassword(email, hashedPassword){
    const dbConnection = pool();

    const result = await dbConnection.query('update users set password = $1 where email = $2', [hashedPassword, email]);
    dbConnection.end();

    return result;
}

module.exports = { 
    addNewUserToDb,
    replaceCourseIds,
    getSubscribedCourses,
    getAllUserInfo,
    getUserByEmail,
    checkResetPasswordAttempts,
    updateResetPasswordAttempts,
    updateUserPassword,
    reactivateUser,
    setUserAsFinanciallyDelinquent
};