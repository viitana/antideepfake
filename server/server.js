const express = require('express');
const bodyParser = require('body-parser')
const { imageHash } = require('image-hash');
const cors = require('cors');
const HashDB = require('./hashdb')

// Config vars
const dbpath = './hashdb.db';
const app = express();
const port = 80;
const corsConfig = {
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'POST',
    'preflightContinue': false
}

// Init db
const db = new HashDB(dbpath, true);

// Init middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsConfig));

// Routing
app.post('/processimg', (req, res) => {
    if(!req.body && req.body.image_source) {
        res.status(400).send('Invalid request body');
        return;
    }
    const url = req.body.image_source;

    // Hash image
    imageHash(url, 16, true, (error, data) => {
        if (error) {
            console.log(`Error hashing ${url}:\n`, error.message);
            res.status(400).send('Unable to hash image');
            return;
        }
        const result = db.hasHash(data);
        console.log(`Successfully hashed ${url}: ${result ? 'match!' : 'no match'} (${data})`);
        res.json({ result: result, hash: data, src: url });
    });
});

// Start
app.listen(port, () => console.log(`Now listening on port ${port}.`));

// Close db connection on exit
process.on('exit', () => db.close());
