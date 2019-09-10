const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const quotesService = require('./quotes.service');

// see: https://expressjs.com/en/resources/middleware/cors.html
const whitelist = [
    'https://quotes-server-stage.herokuapp.com',
    'https://quotes-server-prod.herokuapp.com'
];
if (process.env.NODE_ENV !== 'production') {
    // allow localhost for dev
    whitelist.push('http://localhost:3000');
}

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

// log middleware
app.use(function (req, res, next) {
    console.log(`request url: ${req.url}`);
    next();
});
// static files
app.use(express.static(path.join(__dirname, 'public')));


// get quote
app.get('/quote', cors(corsOptions), (req, res) => {
    const quote = quotesService.getRandomQuote();
    res.json(quote);
});

// index file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


const PORT = process.env.PORT || 4000;	//process.env.PORT is used by heroku
app.listen(PORT,
    () => console.log(`server listening on port ${PORT}`)
);
