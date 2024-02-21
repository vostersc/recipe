const {pool, client} = require('../db/database');
// const {formatUpvotes} = require('../scraper/data');
const dayjs = require('dayjs');

async function cancelScrapeRequest(id){
    const dbConnection = pool();
    try {
        const result = await dbConnection.query('update scraperqueue set cancelled = true where userid = $1', [id]);
        dbConnection.end();

        return result;
    } catch(err){
        console.log('scrape.js: 12 --->', err);
        dbConnection.end();

        return;
    }
}

async function listScrapeRequestsByUser(userId){
    const dbConnection = pool();


    const dbQuery = `
        select * from scraperqueue
        where userid = $1
        and users = false
        and cancelled != true  
    `;
    const r = await dbConnection.query(dbQuery, [userId]);
    if(r.rows.length > 0) return {complete: false};


    const q = `
        select * from scraperqueue
        inner join redditforums
        on forum = forumname
        where userid = $1
        and users = false
        and cancelled != true
    `;
    const result = await dbConnection.query(q, [userId]);
    const hasAtLeastOneForumToCrawl = result.rows?.length > 0;
    if(hasAtLeastOneForumToCrawl){
        dbConnection.end();
        return {complete: false};
    }

    
    const qu = `
        select * from scraperqueue
        inner join redditforums
        on forum = forumname
        where userid = $1
        and users = true
        and cancelled != true
        order by requestgroupid desc
    `;
    const res = await dbConnection.query(qu, [userId]);
    const mostCurrentRequestGroupId = res.rows[0]?.requestgroupid;
    const allSubscribers = res.rows.reduce((acc, cur) => cur.requestgroupid === mostCurrentRequestGroupId ? acc = [...acc, ...cur.subscribers] : acc, []);
    const userHasNoActiveRequests = res.rows?.length === 0;
    if(userHasNoActiveRequests) return {complete: true};

    
    const query = `
        select * from redditusers
        where username = any($1) 
    `;
    const safeSubscribers = allSubscribers?.filter(s => s); //fixes leading , problem eg: '{,sfsdfsdf, sdfdsfsd}'
    const {rows} = await dbConnection.query(query, ['{' + safeSubscribers?.toString() + '}'])
    const completeCount = rows.filter(user => user?.complete)?.length;
    const enoughUsersComplete = (completeCount / allSubscribers.length) > .80;
    if(!enoughUsersComplete){
        dbConnection.end();
        return {complete: false};
    }


    dbConnection.end();
    return {complete: true};
}

async function addScrapeRequestToDatabase(forums, userId){
    const requestLimit = 20;
    const requestgroupid = userId + '' + dayjs().format();
    const data = forums.slice(0, requestLimit).map(forum => ([forum, dayjs().format(), userId, requestgroupid]));
    const query = 'insert into scraperqueue (forumname, requestdate, userid, requestgroupid) values ($1, $2, $3, $4)';
    const poolInstance = pool();

    let promises = [];

    try {
        for(let i = 0; i < data.length; i++){
            promises = [...promises, poolInstance.query(query, data[i])];
        }
    } catch(err){
        console.log('scrape.js: 16 --->', err);
    }

    await Promise.all(promises);
    poolInstance.end();

    return;
}

async function markScrapeRequestAsComplete(forumName, pool){
    if(!forumName) return;
    
    if(!pool){
        return await client().query('update scraperqueue set status = true and inprogress = false where forumname = $1', [forumName]);
    }
    
    return await pool.query('update scraperqueue set status = true and inprogress = false where forumname = $1', [forumName]);
}

async function writeNewRedditDataToDatabase(data, dbConnection){
    ////////////////////////////////
    // write forums table 
    const forumQuery = `
        insert into redditforums
        (forum, subscribers)
        values ($1, $2)
    `;
    const forumData = prepForumsDataTable(data);
    for(let i = 0; i < forumData.length; i++){
        const exists = await dbConnection.query('select * from redditforums where forum = $1', [forumData[i][0]]);
        if(exists.rows.length > 0) continue;

        await dbConnection.query(forumQuery, forumData[i]);
    }



    //////////////////////////////////
    // write comments table
    const commentsQuery = `
        insert into redditcomments 
        (userid, title, postid, forum, comment, upvotes)
        values ($1, $2, $3, $4, $5, $6)
    `;
    // const allCommentsByAllUsers= prepCommentsDataTable(data);
    for(let i = 0; i < allCommentsByAllUsers.length; i++){
        for(let ii = 0; ii < allCommentsByAllUsers[i].length; ii++){
            const exists = await dbConnection.query('select * from redditusers where username = $1', [allCommentsByAllUsers[i][ii]]);
            if(exists.rows.length > 0) continue;
    
            await dbConnection.query(commentsQuery, allCommentsByAllUsers[i][ii]);
        }
    }



    ///////////////////////////////// THIS MUST BE RUN LAST OR IT WILL THINK USER AND ASSOCIATED DATA HAVE ALL BEEN SCRAPED!
    // write user table
    const userQuery = `
        insert into redditusers
        (username, ismoderator, isactive)
        values ($1, $2, $3)
    `;
    const userData = prepUserDataTable(data);
    for(let i = 0; i < userData.length; i++){
        const forumString = userData[i][0];
        const exists = await dbConnection.query('select * from redditusers where username = $1', [forumString]);
        if(exists.rows.length > 0) continue;
        
        await dbConnection.query(userQuery, userData[i]);
    }


    //dbConnection ended in parent 
    return;
}

function prepForumsDataTable(allData){
    return allData.allForumPostUrls.map(forum => {
        const subscribers = allData.allForumUsersData.filter(user => {
            return user.forums.find(userForum => userForum === forum);
        });

        return [
            forum,
            subscribers.map(s => s.userId)
        ];
    });
}

function prepUserDataTable(allData){
    return allData.allForumUsersData.map(user => {
        return [
            user.userId,
            !!user.isModerator,
            user.isActive,
            // user.personality?.openness,
            // user.personality?.extroversion,
            // user.personality?.agreeableness,
            // user.personality?.neuroticism,
            // user.personality?.conscientiousness,
            // user.values?.transcendence,
            // user.values?.conservation,
            // user.values?.enhancement,
            // user.values?.opennesstochange
        ];
    });
}

// function prepCommentsDataTable(allData){
//     return allData.allForumUsersData.map(user => {
//         const comments = user.comments.map(comment => {
//             const title = '';
//             const parentpostid = '';
//             const forum = '';
//             const upvotes = '';

//             return [
//                 user.userId,
//                 title,
//                 parentpostid,
//                 forum,
//                 comment,
//                 upvotes
//             ];
//         });
    
//         const posts = user.posts.map(post => {
//             return [
//                 user.userId,
//                 post.postTitle,
//                 post.postId,
//                 post.forum,
//                 post.postDetails.postText || '',
//                 formatUpvotes(post.postDetails.upVotes)
//             ];
//         });

//         return [...comments, ...posts];
//     });
// }



module.exports = {
    cancelScrapeRequest,
    addScrapeRequestToDatabase,
    markScrapeRequestAsComplete,
    writeNewRedditDataToDatabase,
    listScrapeRequestsByUser
};