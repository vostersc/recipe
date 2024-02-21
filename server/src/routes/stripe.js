const {sendEmail, generateRandomString} = require('../util');
const { getUserByEmail, reactivateUser, addNewUserToDb } = require('../db/user');

// const stripe = require('stripe')(process.env.STRIPE_PRIVATE);
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_DEV);
const endpointSecret =  process.env.STRIPE_GENERATED_ENDPOINT_SECRET_DEV;
// const endpointSecret =  process.env.STRIPE_GENERATED_ENDPOINT_SECRET;

function routes(app){
    app.post('/api/webhook', async (request, response) => {
        try {
            const event = stripe.webhooks.constructEvent(request.body, request.headers['stripe-signature'], endpointSecret);

            if (event.type === 'checkout.session.completed') await fulfillOrder(event.data.object);

            response.status(200).end();
        } catch (err) {
            console.log('stripe.js: 37 --->', err);
            return response.status(400).send(`Webhook Error: ${err.message}`);
        }
    });

    async function fulfillOrder(orderObject){
        try {
            const email = orderObject.customer_details.email;
            const result = await getUserByEmail(email);
            const exists = result?.rows[0];
            if(exists){ //renewing???
                await reactivateUser(orderObject.customer_details.email);
    
                const message = `Thanks for using LeadFinder.tech! Remember, you can log into the site at ${process.env.CLIENT_URL}. Use ${email} as your username and use your current password. If you can't remember it, reset it using ${process.env.CLIENT_URL}/reset. Contact us at ${process.env.SUPPORT_EMAIL} with questions.`;
                await sendEmail(email, 'Welcome Back To LeadFinder.tech!', message)

                return;
            }

            const password = generateRandomString();
            await addNewUserToDb(email, password, orderObject.customer_details.name);

            const message = `Welcome to LeadFinder.tech! Please log into the site at ${process.env.CLIENT_URL}. Use ${email} as your username and ${password} as your password. You have a 7 day free trial, and you can always cancel via the links on the account page of the application. After the trial is over, you will be charged $${process.env.PRICE_PER_MONTH}/month. You can always contact us at ${process.env.SUPPORT_EMAIL}.`;
            await sendEmail(email, 'Welcome to LeadFinder.tech!', message)
            
            return;
        } catch(err){
            console.log('stripe.js: 20 --->', err);
        }
    }
}

module.exports = routes;