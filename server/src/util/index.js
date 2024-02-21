const stripe = require('stripe')(process.env.STRIPE_PRIVATE);
const fs = require('fs');
// const p = require('puppeteer');
const SendInBlue = require('sib-api-v3-sdk');
const {setUserAsFinanciallyDelinquent} = require('../db/user');
// const {getInstance, waitFor} = require('./scraper/new/crawler');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const isProd = !process.env.NODE_ENV?.includes('dev');

SendInBlue.ApiClient.instance.authentications['api-key'].apiKey = process.env.SEND_IN_BLUE_API_KEY;


//fs works from the root of the project so all paths should be written as if accessing from the same level as server.js

async function handleCheckUserWithStripe(email){ //rename, doesn't imply any db updating
    const customers = await stripe.customers.list();
    const customer = customers?.data?.find(customer => customer.email === email);
    if(customer?.delinquent){
        await setUserAsFinanciallyDelinquent(email);
        return false;
    }

    return true;
}

function eliminateDuplicates(opts){
    return opts?.reduce(function(a, b){
        if (a.indexOf(b) < 0) a.push(b);

        return a;
    },[]);
}

function writeToFile(path, data){
    const stream = fs.createWriteStream(path, {flags:'a'});
    stream.write(data);
    stream.end();
}

function parseFile(path){
    if(path.includes('..')) return; //need to stop ability to read anything in fs
    return JSON.parse(fs.readFileSync(path));
}

function logger(req, res, next){
    console.log(req.method, req.url, req.headers.sitetoken, req.params, req.body);
    next();
}

function cleanPath(url){
    return url.split('%20').map(el => el === '%20' ? ' ' : el).join(' ');
}

function translateFromSafeUrl(url){
    if(url.includes('%20')) url = url.split('%20').join(' '); // CAREFUL...

    return url;
}

function courseLookUp(userFields){
    const dictionary = {
        'social-power-foundations-temporary-password': '1'
    };

    return Object.fromEntries(userFields).filter(key => dictionary[key]);
}

function generateRandomString(length = 10){
    const options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    const randomVals = Array(length).join().split(',').map(function() { return options.charAt(Math.floor(Math.random() * options.length)); }).join('');

    return randomVals + '';
}


async function sendEmail(email, subject, text){
    const sendInBlueApi = new SendInBlue.TransactionalEmailsApi();
   
    return sendInBlueApi.sendTransacEmail({
        sender: {email: 'admin@leadfinder.tech', name: 'LeadFinder.tech'},
        to: [{email}],
        subject: subject,
        textContent: text,
    });
}



//this works because getClosestForumMatch only returns one option for each forum otherwise we'd have multiple forums getting crawled for one entry and that would be bad
//see the line after this is called for clarity
async function getClosestForumMatch(forums){
    const path = __dirname + '/scraperData/forums.json';
    const knownForums = JSON.parse(await fs.readFileSync(path));
    const {unknownForums, knownForumMatches} = forums.reduce((acc, possibleForum) => {
        const knownForumMatch = knownForums.find(knownForum => knownForum[0].toLowerCase() === possibleForum.toLowerCase());
        if(!knownForumMatch) return acc = {...acc, unknownForums: [...acc.unknownForums, possibleForum]};

        return acc = {...acc, knownForumMatches: [...acc.knownForumMatches, possibleForum]};
    }, {unknownForums: [], knownForumMatches: []});   

    const possibleForumMatches = await handleAwaitInsideLoop(unknownForums, getPossibleForumMatchFromGoogle);
    if(!possibleForumMatches || possibleForumMatches?.length === 0) return knownForumMatches

    return [...possibleForumMatches, ...knownForumMatches];
}

async function handleAwaitInsideLoop(arr, asyncFn, onErrorFn = () => {}){
    let data = [];
    for(let i = 0; i < arr.length; i++){

        try {
            const result = await asyncFn(arr[i]);
            if(!result) continue;

            data = [...data, ...result];
        } catch (err){
            console.log(err)
            onErrorFn(err);
        }

    }

    return data;
}


// async function getPossibleForumMatchFromGoogle(forum){
//     const url = `https://www.google.com/search?q="reddit.com%2Fr"+"${forum}"`;
//     const {page, closeBrowser} = await getInstance(isProd);
//     await page.goto(url);
//     await waitFor(page);
  
//     const forumData = await page.evaluate(() => {
//         return [...document.querySelectorAll('a')].filter(el => el.href.includes('reddit.com')).map(el => el.href);
//     });

//     closeBrowser();

//     const onlyRedditForumUrls = forumData?.filter(urlStr => urlStr?.includes('reddit.com/r/'));
//     const possibleForumMatches = onlyRedditForumUrls?.map(url => url?.split('reddit.com/r/')[1]?.split('/')[0]);
//     const uniquePossibleMatches = eliminateDuplicates(possibleForumMatches); 
//     if(uniquePossibleMatches?.length > 2) uniquePossibleMatches.length = 2;
//     if(uniquePossibleMatches?.filter(el => !!el).length === 0) return [];

//     return uniquePossibleMatches;
// }



function getRedditUrl(forumName){
    if(!forumName?.length) return;

    return `https://reddit.com/r/${forumName}`;
}

function buildUserProfileLink(userString){
    return `https://reddit.com/u/${userString}`;
}

function buildUserMessageLink(userString, message, subject){
    const baseUrl = `https://reddit.com/message/compose/?to=${userString}`;
    const messageUrl = `&message=${message}`;
    const subjectUrl = `&subject=${subject}`;

    if(!message && !subject) return baseUrl;
    if(!message) return baseUrl + messageUrl;
    if(!subject) return baseUrl + subjectUrl;

    return baseUrl + messageUrl + subjectUrl;
}

function generateRandomNumber(ceil = 100, floor = 1){
    return Math.floor(Math.random() * ceil) + floor;
}

module.exports = {
    getRedditUrl,
    buildUserProfileLink,
    buildUserMessageLink,
    getClosestForumMatch,
    writeToFile,
    parseFile,
    logger,
    cleanPath,
    translateFromSafeUrl,
    courseLookUp,
    sendEmail,
    generateRandomString,
    handleCheckUserWithStripe,
    eliminateDuplicates,
    generateRandomNumber
};