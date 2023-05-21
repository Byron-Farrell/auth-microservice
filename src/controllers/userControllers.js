const User = require('../models/User')
const Payload = require('../models/Payload')
const userSerializers = require('../serializers/userSerializers')

const handleError = (request, response, error) => {
    let data = {
        success: false,
        payload: {
            errors: []
        },
        message: ''
    }

    if (error.name === 'TypeError') {
        data.payload.errors.push({
            field: 'id',
            message: `User with the ID ${request.params.userId} does not exist`
        })
        data.message = 'User Does not exists'

        return response.status(400).jsonp(data)
    }

    if (error.name === 'CastError') {
        data.payload.errors.push({
            field: 'id',
            message: `${request.params.userId} is not a valid user ID`
        })
        data.message = 'Invalid user ID'

        return response.status(400).jsonp(data)
    }

    data.message = 'Unexpected server error'
    return response.status(500).jsonp(error)
}

/**
 * GET method that gets a user defined by the userId url parameter
 * and returns a JSON object contain the user details
 *
 * @param request
 * @param response
 * @returns {Promise<*>}
 */
exports.get = async (request, response) => {


    // Check if user exists
    try {
        const count = User.countDocuments({_id: request.params.userId})

        if (count === 0) {
            // User does not exist
            const payload = new Payload(false, `User with the user id (${request.params.userId}) does not exists`)
            return response.status(404).json(payload)
        }
    } catch(error) {
        // unexpected error
        return handleError(request, response, error)
    }

    let user

    // Get user
    try {
        user = await User.findOne({_id: request.params.userId})
    }
    catch(error) {
       return handleError(request, response, error)
    }

    let serializedUser = userSerializers.userDetail(user)
    const payload = new Payload(true, 'Successfully retrieved user', serializedUser)

    return response.status(200).jsonp(payload)
}

/**
 * DELETE method that deletes a user defined by the user id in the
 * url parameter userId.
 *
 * @param request
 * @param response
 * @returns {Promise<*>}
 */
exports.delete = async (request, response) => {

    try {
        let user = await User.deleteOne({_id: request.params.userId})

        if (user.deletedCount === 0) {
            const payload = new Payload(false, 'User Does not exists')
            payload.addError('id', `User with the ID ${request.params.userId} does not exist`)
            return response.status(404).json(payload)
        }

        const payload = new Payload(true, 'Successfully deleted user')

        return response.status(204).json(payload)
    }
    catch(error) {
        return handleError(request, response, error)
    }

}

exports.list = async (request, response) => {
    let users = await User.find()
    users = users.map(user => userSerializers.userDetail(user))

    return response.jsonp(users)
}

exports.create = async (request, response) => {

    const user = new User({
        username: request.body.username,
        password: request.body.password
    })

    try {
        await user.save()

        let serializedUser = userSerializers.userDetail(user)

        const data = {
            success: true,
            payload: {
                data: serializedUser
            },
            message: 'Successfully create user'
        }

        return response.status(201).jsonp(data)
    }
    catch (error) {
        const duplicateKeyErrorCode = 11000

        let data = {
            success: false,
            payload: {
                errors: []
            },
            message: error.message
        }

        if (error.name === 'MongoServerError') {
            if (error.code === duplicateKeyErrorCode) {
                data.payload.errors.push({
                    field: 'username',
                    message: `a user with the username ${request.body.username} already exists`
                })
            }

            data.message = 'Mongo server error'

            return response.status(400).jsonp(data)
        }

        if (error.name === 'ValidationError') {
            for (let field in error.errors) {
                data.payload.errors.push({
                    field: field,
                    message: `${field} is a required field`
                })
            }

            data.message = 'Validation error'

            return response.status(400).jsonp(data)
        }

        data.message = 'Unexpected server error'

        return response.status(500).jsonp(data)

    }

}