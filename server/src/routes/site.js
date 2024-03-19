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

    app.post('/api/user/harmons', async (req, res) => {
        if(!req.body.username || !req.body.password) res.send('');
    
        //write to DB
    
        return res.send('success');
    });

    app.ws('/api/addToCart/:listName/:username', async (ws, req) => {
        if(!req.params?.listName || !req.params?.username){
            ws.send({error: 'Please enter your Harmons user name or password.', percentComplete: 0, off: null});
            ws.close();
        }       

        //build grocery list items
        const allIngredients = await getGroceries(req.params.listName);
        const cleanIngredients = allIngredients.map(el => { //optimize
            const cleanIngredient = el[0].replace(/[^\w\s]/gi, '').split(' or ')[0].replace(/[0-9]/g, '');
            return cleanIngredient.split(' ').filter(el => ['oz', 'lb', 'g', 'lbs', 'ozs'].includes(el) ? '' : el).join(' ');
        });
        const builtUrls = cleanIngredients.map(el => `http://shop.harmonsgrocery.com/search?search_term=${el}`); //optimize
        const qty = allIngredients.map(el => {  //optimize
            if(!el[1] || el[1].includes('/')) return 1;
            const cleanIngredient = el[1].replace(/[^\d.]/g, '');
            return cleanIngredient ? cleanIngredient : 1;
        });

        // log into harmons
        const C = new Crawler();
        const config = builtUrls.map((url, i) => ({selector: C.exampleActionFunction, urls: [url], qty: qty[i]})); //optimize
        const viewPort = { "width": 1000, "height": 768 };
        const userAgent = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";
        C.performAction(config, false, true, true, false, viewPort, userAgent);


        let intervalId;
        tempPercentComplete = 1;
        intervalId = setInterval(() => { //set up with event emitters...
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
        }, 500);

        ws.on('close', () => cleanUp());
        ws.on('message', e => cleanUp(e));

        function cleanUp(e){
            if(e) console.log('site.js: 81 --->', e);

            clearInterval(intervalId);
            ws.close();
            C.stopCrawler();
        }
    });

}



module.exports = routes;