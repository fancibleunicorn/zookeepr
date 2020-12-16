// get access to Express.js
const express = require('express');

// need fs to write new animals to animals.json
const fs = require('fs');

// node built into Node.js for workith with file and directory paths
const path = require('path');

const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// get access to animals.js
const { animals } = require('./data/animals.json');

// set up the port default for heroku
const PORT = process.env.PORT || 3001;

// to initiate the server
const app = express();

//Middleware functions:
// parse incoming string or array data (extended data true tells it to parse all data, including sub-arrays)
app.use(express.urlencoded({ extended: true}));
//parse incoming JSON data
app.use(express.json());

//teslls server that any /api sites will use router in apiRoutes, if / it will use HTML routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);
// allows live server to use CSS and javscript assets (anything in the public folder)
app.use(express.static('public'));

// method to make server listen (traditionally at the very end of your script)
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});