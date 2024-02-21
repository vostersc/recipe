const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function validateToken(token){
    if(!token) return false;

    try {
        return await jwt.verify(token, process.env.TOKEN_SECRET);
    } catch(err){
        return false;
    }
}

async function authMiddleware(req, res, next){
    if(process.env.NODE_ENV?.includes('dev')) return next();
    
    const isApiCall = req.url?.includes('/api');
    if(!isApiCall) return;

    const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const hittingStripeUrl = requestUrl?.includes('/api/webhook');
    if(hittingStripeUrl) return next();

    const validToken = await validateToken(req.headers.sitetoken);
    const tryingToLogIn = req.url === '/api/authenticate' || req.url?.includes('/api/resetPassword');

    if(!validToken && !tryingToLogIn) return res.send({ status: false });

    next();
}

function generateAccessToken(username){
    return jwt.sign({username}, process.env.TOKEN_SECRET, {expiresIn: '8d'});
}

async function checkPw(hash, passwordAttempt){
    if(!passwordAttempt || !hash) return false;

    const isMatch = await bcrypt.compare(passwordAttempt, hash);
    return isMatch;
}

async function hashPw(password){
    return await bcrypt.hash(password, await bcrypt.genSalt(10));
}

module.exports = {
    validateToken,
    authMiddleware,
    generateAccessToken,
    checkPw,
    hashPw
};