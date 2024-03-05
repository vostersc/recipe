const {getGroceries, getGroceryLists} = require('@vostersc/paprika');
const Crawler = require('@vostersc/crawler');
// const {pool, getUserByEmail} = require('../db/database');
// const {generateAccessToken, validateToken, checkPw, hashPw} = require('../auth/auth');
// const {getSubscriptionsToATag} = require('../api');



function routes(app){
    app.get('/api/groceryLists', async (req, res) => {
        
        const groceryLists = await getGroceryLists();
    
        res.send(groceryLists);
    });

    app.get('/api/groceries/:listName?', async (req, res) => {
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
        // const qty = allIngredients.map(el => { //ADD LATER
        //     if(!el[1] || el[1].includes('/')) return 1;
        //     const cleanIngredient = el[1].replace(/[^\d.]/g, '');
        //     return cleanIngredient ? cleanIngredient : 1;
        // });
     
        const C = new Crawler();
        const config = builtUrls.map(url => ({selector: C.exampleActionFunction, urls: [url]}));
        C.performAction(config, false, false, true);

        let intervalId;
        tempPercentComplete = 1;
        intervalId = setInterval(() => {
            try {
                const percentComplete = C.getStatus();
                if(percentComplete < 100){
                    ws.send(JSON.stringify({error: false, percentComplete, off: null, name: req.params.listName}));
                    return;
                }

                clearInterval(intervalId);
                ws.send(JSON.stringify({error: false, percentComplete: 100, off: null, name: req.params.listName}));
                ws.close();
                return;

            } catch(err){
                ws.send(JSON.stringify({error: true, percentComplete: 0, off: true, name: req.params.listName}));   
                cleanUp(err);
                C.stopCrawler();
            }
        }, 1000);

        ws.on('close', () => cleanUp());
        ws.on('message', e => cleanUp(e));

        function cleanUp(e){
            console.log('site.js: 81 --->', e);
            clearInterval(intervalId);
            ws.close();
            C.stopCrawler();
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