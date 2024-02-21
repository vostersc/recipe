const {pool} = require('../db/database');
const {generateAccessToken, validateToken, checkPw, hashPw} = require('../auth');
const {getUserByEmail, updateUserPassword, checkResetPasswordAttempts, updateResetPasswordAttempts} = require('../db/user');
const { sendEmail, generateRandomString} = require('../util');
const moment = require('moment');

function routes(app){

    app.post('/api/resetPassword/:email', async (req, res) => {
        const validEmail = req.params?.email && req.params.email.includes('@') && req.params.email.includes('.') && req.params.email.length > 3;
        if(!validEmail) return res.status(400).send({status: false});
    
        try {
            const matchingUserData = await checkResetPasswordAttempts(req.params.email);
            const fifteenMinutesAgo = moment().utc().subtract(15, 'minutes');
            const removeIrrelevantAttempts = obj => moment(obj.date, 'M/D/YYYY, H:mm:ss A').isAfter(fifteenMinutesAgo);
            const tooManyAttempts = matchingUserData.rows?.filter(removeIrrelevantAttempts).length > 3;
            if(tooManyAttempts) return res.status(400).send({status: 'too many requests'});
    
            await updateResetPasswordAttempts(req.params.email);
            const password = generateRandomString();
            await updateUserPassword(req.params.email, await hashPw(password));
            const message = `You requested a password reset. Please log in at ${process.env.CLIENT_URL} with the new password, as soon as possible. Your new password is: ${password}`;
            await sendEmail(req.params.email, 'Reset Password', message);
    
            res.send({status: true});
        } catch(err){
            res.status(500).send({status: false});
        }


    });

    app.post('/api/authenticate', async (req, res) => {
        if(!req.body.username || !req.body.password) return res.send({ status: false, message: 'include username and password'});

        try {
            const userMatches = await getUserByEmail(req.body.username);
            const oneUser = userMatches?.rows[0];
            if(!(await checkPw(oneUser?.password, req.body.password))) return res.send({status: false});

            const token = generateAccessToken(req.body.username);
            const userData = {id: oneUser.id, isFirstTime: oneUser.isfirsttime, email: oneUser.email, courses: oneUser.courses};

            return res.send({ status: true, token, user: userData }); 

        } catch(err){
            console.log('users.js: 56 --->', err);
            return res.send({status: false, message: 'error'});
        }

    });








    
    app.patch('/api/user/:id', async (req, res) => {
        const dbConnection = pool();

        try {
            const pwForDatabase = await hashPw(req.body.password);

            await dbConnection.query('update users set password = $2, isFirstTime = false where id = $1', [req.body.id, pwForDatabase]);

            dbConnection.end();

            return res.send({status: true});
        } catch(err){
            console.log('users.js: 82 --->', err);
            dbConnection.end();

            return res.send({status: false});
        }
    });

    
    app.get('/api/validate', async (req, res) => {
        const userName = await validateToken(req.headers.sitetoken); 
        if(!userName) return res.send({status: false});

        const dbConnection = pool();

        dbConnection.query('select * from users where email = $1', [userName.username], (err, result) => {
            if(err) return res.send({status: false});

            const user = result?.rows[0];
            if(!user) return res.send({status: false});
            const userData = {id: user.id, isFirstTime: user.isfirsttime, email: user.email, courses: user.courses};

            dbConnection.end();

            return res.send({ status: true, token: req.headers.sitetoken, user: userData }); 
        });
    });
}

module.exports = routes;