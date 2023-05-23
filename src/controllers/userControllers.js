const User = require('../models/User')
const Payload = require('../models/Payload')

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

    // Get the users ID from query parameter
    const id = request.params.userId
    let user // User object will be stored here

    // Get user
    try {
        user = await User.findOne({_id: id})

        // User does not exist
        if (user == null) {
            const payload = new Payload(false, `User with the user id (${request.params.userId}) does not exists`)
            return response.status(404).json(payload)
        }
    }
    catch(error) {
       return handleError(request, response, error)
    }


    const payload = new Payload(true, 'Successfully retrieved user', user.getDetail())

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

    let user

    // Try and delete use with the user id defined in request.params.userId
    try {
        user = await User.deleteOne({_id: request.params.userId})
    }
    catch(error) {
        return handleError(request, response, error)
    }

    if (user.deletedCount === 0) {
        // User does not exist
        const payload = new Payload(false, 'User Does not exists')
        payload.addError('id', `User with the ID ${request.params.userId} does not exist`)

        return response.status(404).json(payload)
    }

    return response.status(204).send()

}

/**
 * GET method that gets all users in the system. returns a
 * JSON object of all users
 *
 * @param request
 * @param response
 * @returns {Promise<*>}
 */
exports.list = async (request, response) => {

    // Get all users
    let users = await User.find()

    // serialize user objects
    users = users.map(user => user.getDetail())

    if (users.length === 0) {
        const payload = new Payload(true, 'There a are currently no users in the system')
        return response.status(204).json(payload)
    }

    const payload = new Payload(true, `Successfully retrieved ${users.length} users`, users)

    return response.status(200).json(payload)
}