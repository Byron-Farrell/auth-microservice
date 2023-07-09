const express = require('express');
const authControllers = require('../controllers/authControllers');
const { routes } = require('./routesConfig')


const router = express.Router();
console.log(routes)
router.post(routes.login.path, authControllers.login);
router.post(routes.register.path, authControllers.register);

module.exports = router;