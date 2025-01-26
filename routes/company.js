const express = require('express');
const router = express.Router();
const controller = require('../controllers/company');
const validation = require("../middleware/validation");

router.get('/', validation.authenticateToken, controller.listAll);

router.get('/:id', validation.authenticateToken, controller.getById);

router.post('/', validation.authenticateToken, controller.register);

router.put('/:id', validation.authenticateToken, controller.update);

router.delete('/:id', validation.authenticateToken, controller.delete);

module.exports = router;