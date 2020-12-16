const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

const router = require('express').Router();


// route to animals.js, get() requires 2 arguments: a string to describe the route to fetch from, and a callback function that will execute every time the route is accessed with a GET request
router.get('/animals', (req, res) => {
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

router.get('/animals/:id', (req, res) => {
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
router.post('/animals', (req, res) => {
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

module.exports = router;