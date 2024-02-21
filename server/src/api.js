const axios = require('axios');

require('dotenv').config();

async function getSubscriptionsToATag(){
    const tagId = '3248116'; //purchase1 tag
    const auth = `?api_secret=${process.env.CONVERTKIT}`;
    const url = `https://api.convertkit.com/v3/tags/${tagId}/subscriptions${auth}`;

    try {
        const result = await axios.get(url);
        return result?.data.subscriptions;
    } catch(err){

        return [];
    }
}

module.exports = {
    getSubscriptionsToATag
};