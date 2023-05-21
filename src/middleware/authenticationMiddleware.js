
const jwt = require('jsonwebtoken')
const Payload = require('../models/Payload')
const authConfig = require('../config/auth')

exports.verifyToken = async (request, response, next) => {

    const authorizationHeaderExists = Object.hasOwn(request.headers, 'authorization')

    if (!authorizationHeaderExists) {
        let payload = new Payload(false, 'Missing authorization header')

        return response.status(401).json(payload)
    }

    const token = request.headers.authorization.split(' ')[1]

    jwt.verify(token, authConfig.JWT_SECRET_KEY, (error, decoded) => {

        if (error) {
            let payload = new Q(false, error.message)
            return response.status(401).json(payload)
        }

        next()
    })
}