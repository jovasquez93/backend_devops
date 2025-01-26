const express = require('express');
const router = express.Router();
const controller = require('../controllers/login');

router.post('/login', controller.auth);

router.post('/register', controller.register);

module.exports = router;