// get access to Express.js
const express = require('express');

// get access to animals.js
const { animals } = require('./data/animals.json');

// set up the port default for heroku
const PORT = process.env.PORT || 3001;

// to initiate the server
const app = express();

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

// method to make server listen
app.listen(PORT, () => {
    console.log('API server now on port ${PORT}!');
});