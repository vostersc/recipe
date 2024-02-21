// const {pool, getUserByEmail} = require('../db/database');
// const {generateAccessToken, validateToken, checkPw, hashPw} = require('../auth/auth');
// const {getSubscriptionsToATag} = require('../api');
// const {addNewUserToDb} = require('../db/database');
// const {eliminateDuplicates} = require('../util');

const fs = require('fs');

function routes(app){

    app.get('/api/forumAutocomplete', async (req, res) => {
        if(req.query.search?.length < 2) return res.send([]);

        const forumDataFileBasePath = __dirname + '/../scraperData';
        const forumsRaw = fs.readFileSync(forumDataFileBasePath + '/forums.json');
        const forums = JSON.parse(forumsRaw);
   
        const possibleMatches = forums.filter(forum => forum[0]?.toLowerCase().includes(req.query?.search?.toLowerCase()));
        const orderedPossibleMatches = possibleMatches.sort((a, b) => Number(a[1]) > Number(b[1]));

        const noDuplicates = orderedPossibleMatches.reduce((acc, cur) => {
            const unique = acc.filter(el => el[0]?.toLowerCase() === cur[0]?.toLowerCase())?.length === 0;
            if(!unique) return acc;

            return acc = [...acc, cur];
        }, []);

        res.send(noDuplicates);
    });

}



module.exports = routes;