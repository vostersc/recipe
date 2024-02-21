const {addScrapeRequestToDatabase} = require('../db/scrape');
const {pool} = require('../db/database');
const {getClosestForumMatch} = require('../util');
const { cancelScrapeRequest, listScrapeRequestsByUser } = require('../db/scrape');
const stringSimilarity = require('string-similarity');
// const Sentiment = require('sentiment');
const analyze = require('@vostersc/personality');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();
// const sentimentTool = new Sentiment();
// const Readable = require('stream').Readable;

function routes(app){

    app.get('/api/listPendingRequests/:userId', async (req, res) => {
        if(!req.params.userId) return res.status(400).send('Missing userId parameter.');

        const result = await listScrapeRequestsByUser(req.params.userId);
        res.send(result);
    });

    app.get('/api/getComputedDetails/:recipient', async (req, res) => {
        if(!req.params?.recipient) return res.status(400).send('Missing "recipient" url string property.');

    
        const getUserDetails = `
            select * from redditusers
            left join redditcomments 
            on username = userid
            where username = $1
        `;
        const instance = pool();
        let {rows} = await instance.query(getUserDetails, [req.params.recipient]);
        await instance.end();
        if(!rows?.length){
            return res.status(400).send('Could not find recipient.');
        }
        
        const user = rows?.reduce((acc, cur) => {
            if(!acc?.username) return acc = {...acc, ...cur};
            
            return acc = {...acc, comments: [...acc.comments, cur.comment], upvotes: acc.upvotes ? Number(acc.upvotes) + Number(cur.upvotes) : 0};
        }, {comments: []});
        if(user?.comment) delete user?.comment;        


        const commentBlock = user?.comments?.reduce((acc, cur) => acc = acc + cur + ' ', '');
        // const sentiment = sentimentTool.analyze(commentBlock);
        // const personality = analyze(commentBlock);
        const releventWords = await wordpos.getPOS(commentBlock);
        const words = [...releventWords.nouns, ...releventWords.adjectives, ...releventWords.verbs, ...releventWords.adverbs]?.join(' ');
        const wordCloud = words?.split(' ')?.reduce((acc, cur) => {
            const punctuationless = cur.replace(/[.,?"\/#!$%\^&\*;:{}=\-_`~()]/g,''); //eslint-disable-line no-useless-escape
            const finalString = punctuationless.replace(/\s{2,}/g,' '); //eslint-disable-line no-useless-escape
            const keyExists = acc[cur];
            if(keyExists) return acc = {...acc, [finalString]: acc[finalString] + 1};

            return acc = {...acc, [finalString]: 1};
        }, {});

        const result = {...user, personality, wordCloud };


        res.send(result);
    });

    app.delete('/api/cancelScrape/:userId', async (req, res) => {
        if(!req.params.userId) return res.status(400).send('Missing "userId url parameter.');
        
        try {
            await cancelScrapeRequest(req.params.userId);

            return res.send('Success');

        } catch(err){
            res.status(500).send('Server error. Try again soon.');
        }
    });

    app.post('/api/requestScrape', async (req, res) => {
        if(!req.body.userId || !req.body.forums.length) return res.status(400).send('missing argument');

        try {
            const uniqueForums = Object.keys(req.body.forums?.reduce((lookup, cur) => lookup = {...lookup, [cur]: cur}, {})); //hash for unique
            const possibleMatches = await getClosestForumMatch(uniqueForums);
            const forums = possibleMatches.filter(userEnteredForum => uniqueForums.find(possibleForum => stringMatch(possibleForum, userEnteredForum))); //this works because getClosestForumMatch only returns one option for each forum otherwise we'd have multiple forums getting crawled for one entry and that would be bad
            const unknownForums = uniqueForums.filter(userEnteredForum => !possibleMatches.find(possibleForum => stringMatch(possibleForum, userEnteredForum)));

            const matches = forums.length > 0;
            if(!matches) return res.send({unknownForums, status: 'failure'});

            // const lowerCasedForums = forums.map(f => f.toLowerCase());
            const uniqueForumsFinal = Object.keys(forums?.reduce((lookup, cur) => lookup = {...lookup, [cur.toLowerCase()]: cur.toLowerCase()}, {}));
            await addScrapeRequestToDatabase(uniqueForumsFinal, req.body.userId);

            if(matches && unknownForums.length > 0) return res.send({unknownForums, status: 'success'});

            res.send({status: 'success'});
        } catch(err){
            console.log('scraper.js: 50 --->', err);
            res.status(500).send('error');
        }
    });

    function stringMatch(str1, str2){
        const score = stringSimilarity.compareTwoStrings(str1.toLowerCase(), str2.toLowerCase());
        if(score >= .8) return true;
        
        const directStringmatch = str1.toLowerCase() === str2.toLowerCase();
        return directStringmatch;
    }

    app.get('/api/listAllRequests/:userid', async (req, res) => {
        if(!req.params.userid) return res.status(412).send({message: 'Request must include "userid" as a URL parameter.'});
        
        const getAllTopLevelData = `
            select * from scraperqueue
            left join redditforums
            on forum = forumname
            where userid = $1
            and cancelled != true
            order by requestgroupid desc
        `;

        const instance = pool();
        let {rows} = await instance.query(getAllTopLevelData, [req.params.userid]);
        await instance.end();

        for(let i = 0; i < rows.length; i++){
            await attachPercentComplete(rows[i]);
        }

        const forumDataGroupedByRequestGroupId = rows.reduce((acc, forum) => {
            if(!acc[forum.requestgroupid]) return acc = {...acc, [forum.requestgroupid]: [forum]};

            const newPlusOld = {[forum.requestgroupid]: [...acc[forum.requestgroupid], forum]};
            return acc = {...acc, ...newPlusOld};
        }, {});

        res.send(forumDataGroupedByRequestGroupId);        
    });

    app.get('/api/allData/:userId', async (req, res) => {
        if(!req.params.userId) return res.status(412).send({message: 'Request must include "userId" as a URL parameter.'});


        // needs to get all requests that aren't cancelled, even if they don't yet have values inserted into the redditforums table
        const getAllData = `
            select * from scraperqueue
            left join redditforums 
            on forum = forumname
            where userid = $1
            and cancelled != true
            order by requestgroupid desc
        `;
        const instance = pool();
        let {rows} = await instance.query(getAllData, [req.params.userId]);
        const noPastRequests = rows.length === 0;
        if(noPastRequests) return res.send({});


        // add details to each forum
        for(let i = 0; i < rows.length; i++){
            //combine this query with the above query to avoid loops. do it when you feel like joining on _text arrays...
            const getUserDetailsAndAllCommentQuery = `
                select * from redditusers
                left join redditcomments
                on username = userid
                where userid = Any($1)
                order by username desc 
            `;
            const safeD = rows[i]?.subscribers?.filter(el => el); //fixes leading , problem eg: '{, fsfsd, sdfsdfdasf}'
            const requestData = '{' + safeD.toString() + '}';
            const {rows: details} = await instance.query(getUserDetailsAndAllCommentQuery, [requestData]);

            rows[i] = {...rows[i], details: details.flat()};
            await attachPercentComplete(rows[i]);
            rows[i].details = rows[i].details?.reduce((acc, cur) => {
                const foundUser = acc.find(existingUser => {
                    const match = cur.username === existingUser.username;
                    if(match) existingUser.comments = [...existingUser.comments, cur];

                    return match;
                });
                if(!foundUser) return acc = [...acc, {...cur, comments: [cur]}];
            
                return acc;
            }, []);
        }
        await instance.end();  

        // group by request group id
        const forumDataGroupedByRequestGroupId = rows.reduce((acc, forum) => {
            if(!acc[forum.requestgroupid]) return acc = {...acc, [forum.requestgroupid]: [forum]};

            const newPlusOld = {[forum.requestgroupid]: [...acc[forum.requestgroupid], forum]};
            return acc = {...acc, ...newPlusOld};
        }, {});

        // const rs = Readable();
        // rs._read = function () { rs.push(JSON.stringify(forumDataGroupedByRequestGroupId)); };
        // rs.pipe(res);

        return res.send(forumDataGroupedByRequestGroupId);
    
        // const data = JSON.stringify(forumDataGroupedByRequestGroupId);
        // const splitData = data;
        // for(let i = 0; i < splitData.length; i++){
        //     res.write(splitData[i]);
        // }

        // res.end();
    });
}

async function attachPercentComplete(forum){
    if(!forum.inprogress && !forum.users) return forum.percentComplete = 0;
    if(forum.inprogress && !forum.users) return forum.percentComplete = 10;

    const dbConnection = pool();
    const q = `
        select * from redditforums
        inner join redditusers
        on username = Any(redditforums.subscribers)
        where complete != true
        and forum = $1
        and tries < 4
        and inprogress != true
    `;
    const {rows} = await dbConnection.query(q, [forum.forumname]);
    await dbConnection.end();

    const incompleteCount = rows.length;
    const allPossibleSubscribers = forum.subscribers?.length;
    const percentUserProfileComplete = Math.trunc((1 - (incompleteCount / allPossibleSubscribers)) * 100);

    const userDetailCrawlingHasStartedButIsntVeryFar = !forum.inprogress && forum.users && percentUserProfileComplete <= 2;
    if(userDetailCrawlingHasStartedButIsntVeryFar) return forum.percentComplete = 20;
    if(percentUserProfileComplete < 36) return forum.percentComplete = 30;

    forum.percentComplete = percentUserProfileComplete;
}

module.exports = routes;