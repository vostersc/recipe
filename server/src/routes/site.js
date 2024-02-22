const {getGroceries, getToken, getGroceryLists} = require('@vostersc/paprika');
// const {pool, getUserByEmail} = require('../db/database');
// const {generateAccessToken, validateToken, checkPw, hashPw} = require('../auth/auth');
// const {getSubscriptionsToATag} = require('../api');



function routes(app){

    app.get('/api/groceryLists', async (req, res) => {
        await getToken('kaleigh.niemela@gmail.com', 'tCk1mb^IFUv9H2yE');
        const groceryLists = await getGroceryLists();
    
        res.send(groceryLists);
    });

    app.get('/api/groceries/:listName?', async (req, res) => {
        await getToken('kaleigh.niemela@gmail.com', 'tCk1mb^IFUv9H2yE');
        const groceries = await getGroceries(JSON.parse(req.params?.listName));

        res.send(groceries);
    });

}



module.exports = routes;