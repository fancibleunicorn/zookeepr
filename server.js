// get access to Express.js
const express = require('express');

// need fs to write new animals to animals.json
const fs = require('fs');

// node built into Node.js for workith with file and directory paths
const path = require('path');

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
// allows live server to use CSS and javscript assets (anything in the public folder)
app.use(express.static('public'));

function filterByQuery(query, animalsArray) {
    // for handling searching info stored in an array
    let personalityTraitsArray = [];
    //Note that we ave the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        //Save personalityTraits as a dedicated arry.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits == 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop thorugh each trait in the persnalityTrais array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;

    //push new animal to array
    animalsArray.push(animal);
    //write new animal to animals.json
    fs.writeFileSync(
        // creates pathway to where the animals.json file is stored
        path.join(__dirname, './data/animals.json'),
        //converts javascript array to JSON, null means we don't want to edit existing data, and 2 mean we want to create white space between values to make readable
        JSON.stringify({ animals: animalsArray}, null, 2)
    );
    
    //return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;

}

// route to animals.js, get() requires 2 arguments: a string to describe the route to fetch from, and a callback function that will execute every time the route is accessed with a GET request
app.get('/api/animals', (req, res) => {
    // use send() from res parameter to send string
        // res.send('Hello!');

    //use res.json() to send json code
    // res.json(animals);

    // use req.query to filter based on parameters
    // let results = animals;
    // console.log(req.query)
    // res.json(results);

    // calls filterByQuery()
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    // use req.params to find one specific animal, this MUST come AFTER the other get routes
    const result = findById(req.params.id, animals);
    if (result) {
    res.json(result);
    } else {
        //throw 404 error if no matching animal is found based on id
        res.send(404);
    }
})

// for adding user input to the server (i.e. new animals)
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be

    //set's new animal's id to next highest number
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        //add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }
});

app.get('/', (req, res) => {
    // route between index.html and server.js
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
    // route between animals.html and server.js
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
    // route between zookeepers.html and server.js
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// method to make server listen (traditionally at the very end of your script)
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});