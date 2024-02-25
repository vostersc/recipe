const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
// const Ddos = require('ddos');
const {logger} = require('./src/util');
// const {setHeaders} = require('./src/config');
// const initScraperRoutes = require('./src/routes/scraper');
const initSiteRoutes = require('./src/routes/site');
// const initUserRoutes = require('./src/routes/users');
// const {authMiddleware} = require('./src/auth');
// const initStripeRoutes = require('./src/routes/stripe');
// const fs = require('fs');
const cors = require('cors');
require('express-ws')(app); //webSocket available

require('dotenv').config({ path: path.join(__dirname, '.env') });
// const ddos = new Ddos({burst:10, limit:15});

// const stripeOrigins = JSON.parse(fs.readFileSync('./stripeIps.json')).ips;
// app.use('/api/webhook', cors({ origin: "*", credentials: true, methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'] }));
app.use(cors({
    origin: process.env.NODE_ENV?.includes('dev') ? "*" : function (origin, callback) {
        const whitelist = [process.env.CLIENT_URL, ]; //[process.env.CLIENT_URL, ...stripeOrigins];
        const isAllowed = !(whitelist.indexOf(origin) === -1 || !origin);
        if (!isAllowed) return callback(new Error('Not allowed by CORS'));

        callback(null, true);
    },
    origin: "*",
    credentials: true,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// app.use('/api/webhook', bodyParser.raw({type: "*/*"}));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));
// app.use(ddos.express);

app.use(logger);
// app.use(authMiddleware);

// initScraperRoutes(app);
// initUserRoutes(app);
initSiteRoutes(app);
// initStripeRoutes(app);

app.listen(process.env.PORT, () => console.log(`listening on ${process.env.PORT}`));