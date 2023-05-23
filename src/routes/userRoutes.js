const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/userControllers')


router.get('/', userControllers.list)

router.get('/:userId', userControllers.get)

router.delete('/:userId', userControllers.delete)

module.exports = router