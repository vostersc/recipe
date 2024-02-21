const axios = require('axios');
const Paprika = require('paprika-api').PaprikaApi;

const {Temporal} = require('@js-temporal/polyfill');
const crawler = require('@vostersc/crawler');

// Assuming you have your Paprika3 API credentials
const email = 'kaleigh.niemela@gmail.com';
const password = 'tCk1mb^IFUv9H2yE';

// Define the endpoint for the login API
// const loginUrl = 'https://www.paprikaapp.com/api/v2/account/login';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDc5ODU3NDMsImVtYWlsIjoia2FsZWlnaC5uaWVtZWxhQGdtYWlsLmNvbSJ9.olrqIzLeIcY4RWHkT2jybHc4jhRChcdfYGMfslKxAno';

const config = { headers: {'Authorization': `Bearer ${token}`} };

//curl -X POST https://paprikaapp.com/api/v2/account/login -d 'email=kaleigh.niemela%40gmail.com&password=tCk1mb%5EIFUv9H2yE'

(async function(){

    const P = new Paprika(email, password);
    
    async function getGroceriesByScheduledDateRange(startDate = '2024-02-10', daysToInclude = 7){
        const futureMenus = await axios.get('https://www.paprikaapp.com/api/v2/sync/meals', config); 
        const checkIsWithinBounds = compareDate(startDate, daysToInclude);

        const recipesWithinBounds = futureMenus.data.result.filter(el => {
            if(!checkIsWithinBounds(el.date)) return;

            return el;
        });

        let ingredients = [];
        for(let i = 0; i < recipesWithinBounds.length; i++){
            const recipe = await P.recipe(recipesWithinBounds[i].recipe_uid);
            ingredients = [...ingredients, recipe.ingredients];
        }
       
        const cleanIngredients = ingredients.map(el => {
            return el.toString().split('\n').filter(el => el !== '');
        }).flat();

        return cleanIngredients;
    }

    function compareDate(startDate, daysToInclude){
        const tFirstDateAcceptable = Temporal.PlainDateTime.from(startDate);
        const tLastDateAcceptable = tFirstDateAcceptable.add({days: daysToInclude});

        return function(rawDateToCheck){
                const dateToCheck = Temporal.PlainDateTime.from(rawDateToCheck);
                const isAfterEnd = Temporal.PlainDateTime.compare(tLastDateAcceptable, dateToCheck) < 0;
                const isBeforeStart = Temporal.PlainDateTime.compare(tFirstDateAcceptable, dateToCheck) > 0;
                if (isBeforeStart || isAfterEnd) return false;

                return true;
        }     
    }

    compareDate('2024-02-17 00:00:00', 7);

    async function getGroceriesFromList(requestedList = 'Grocery List'){
        const groceryLists = await axios.get('https://www.paprikaapp.com/api/v2/sync/grocerylists', config);
        const active_list = groceryLists.data.result.find(el => el.name === requestedList);
        const allGroceries = await P.groceries();
        const filteredGroceryItems = allGroceries.filter(el => el.list_uid === active_list.uid);
        const groceries = filteredGroceryItems.map(el => [el.ingredient, el.quantity]); 
        return groceries;
    }







    // const ingredients = await getGroceriesByScheduledDateRange('2024-02-10', 7);

    const allIngredients = await getGroceriesFromList();
////////////////////// END PAPRIKA
////////////////////// BEGIN CRAWLER


    const cleanIngredients = allIngredients.map(el => {
        const cleanIngredient = el[0].replace(/[^\w\s]/gi, '').split(' or ')[0].replace(/[0-9]/g, '');
        return cleanIngredient.split(' ').filter(el => ['oz', 'lb', 'g', 'lbs', 'ozs'].includes(el) ? '' : el).join(' ');
    });
    const builtUrls = cleanIngredients.map(el => `http://shop.harmonsgrocery.com/search?search_term=${el}`);

    (async function(){
        const qty = allIngredients.map(el => {
            if(!el[1] || el[1].includes('/')) return 1;
            const cleanIngredient = el[1].replace(/[^\d.]/g, '');
            return cleanIngredient ? cleanIngredient : 1;
        });
        
        await crawler.doAction(builtUrls, crawler.exampleActionFunction, qty, true, true);
    })()




})()
