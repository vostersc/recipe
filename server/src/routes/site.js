const {getGroceries, getToken, getGroceryLists} = require('@vostersc/paprika');
const crawler = require('@vostersc/crawler');
// const {pool, getUserByEmail} = require('../db/database');
// const {generateAccessToken, validateToken, checkPw, hashPw} = require('../auth/auth');
// const {getSubscriptionsToATag} = require('../api');



function routes(app){
    getToken('kaleigh.niemela@gmail.com', 'tCk1mb^IFUv9H2yE'); //MOVE TO MIDDLEWARE

    app.get('/api/groceryLists', async (req, res) => {
        
        const groceryLists = await getGroceryLists();
    
        res.send(groceryLists);
    });

    app.get('/api/groceries/:listName?', async (req, res) => {
        // await getToken('kaleigh.niemela@gmail.com', 'tCk1mb^IFUv9H2yE');
        if(!req.params?.listName){
            const groceries = await getGroceries();

            return res.send(groceries);
        }

        const groceries = await getGroceries(JSON.parse(req.params?.listName));

        return res.send(groceries);
    });

    app.ws('/api/addToCart/:listName', async (ws, req) => {
        if(!req.params?.listName){
            ws.send({error: true, percentComplete: 0, off: null});
            ws.close();
        }       

        const allIngredients = await getGroceries(req.params.listName);
        const cleanIngredients = allIngredients.map(el => {
            const cleanIngredient = el[0].replace(/[^\w\s]/gi, '').split(' or ')[0].replace(/[0-9]/g, '');
            return cleanIngredient.split(' ').filter(el => ['oz', 'lb', 'g', 'lbs', 'ozs'].includes(el) ? '' : el).join(' ');
        });
        const builtUrls = cleanIngredients.map(el => `http://shop.harmonsgrocery.com/search?search_term=${el}`); 
        const qty = allIngredients.map(el => {
            if(!el[1] || el[1].includes('/')) return 1;
            const cleanIngredient = el[1].replace(/[^\d.]/g, '');
            return cleanIngredient ? cleanIngredient : 1;
        });

        console.log('site.js: 50 --->', builtUrls, qty);        
        // crawler.doAction(builtUrls, crawler.exampleActionFunction, qty, true, true); // ASYNC

        let intervalId;
        tempPercentComplete = 1;
        intervalId = setInterval(() => {
            try {
                const nextNum = getRandomWholeNumber(5, 20);
                tempPercentComplete = tempPercentComplete + nextNum >= 100 ? 100 : tempPercentComplete + nextNum;
                console.log('site.js: 59 --->', tempPercentComplete);
                // const percentComplete = crawler.statusUpdate();
                // if(percentComplete === 100){
                //     clearInterval(intervalId);
                //     ws.send({error: false, percentComplete, off: null, name: req.params.listName});
                //     ws.close();
                //     return;
                // }

                ws.send(JSON.stringify({error: false, percentComplete: tempPercentComplete, off: null, name: req.params.listName}));
            } catch(err){
                ws.send({error: true, percentComplete: 0, off: true, name: req.params.listName});   
                cleanUp(err);
            }
        }, 1000);

        ws.on('close', () => cleanUp());
        ws.on('message', e => cleanUp(e));

        function cleanUp(e){
            console.log('site.js: 81 --->', e);
            // crawler.stop();
            clearInterval(intervalId);
            ws.close(); 
        }

        function getRandomWholeNumber(min, max) {
            // Generate a random decimal number between 0 and 1
            const randomDecimal = Math.random();
        
            // Scale and shift the random decimal to fit the desired range
            const randomNumberInRange = Math.floor(randomDecimal * (max - min + 1)) + min;
        
            return randomNumberInRange;
        }
    });

}



module.exports = routes;