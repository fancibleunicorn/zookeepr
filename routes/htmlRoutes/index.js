const path = require('path');
const router = require('express').Router();

router.get('/', (req, res) => {
    // route between index.html and server.js
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/animals', (req, res) => {
    // route between animals.html and server.js
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
    // route between zookeepers.html and server.js
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

module.exports = router;