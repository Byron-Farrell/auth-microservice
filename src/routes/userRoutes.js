const express = require('express');

const userControllers = require('../controllers/userControllers');
const { routes } = require('./routesConfig');


const router = express.Router();

router.get(routes.listUsers.path, userControllers.list);
router.get(routes.getUser.path, userControllers.get);
router.delete(routes.deleteUser.path, userControllers.delete);
router.patch(routes.patchUser.path, userControllers.patch);

module.exports = router;