const authControllers = require("../controllers/authControllers");
const userControllers = require("../controllers/userControllers");

// TODO: unit test to test methid field is correct (compare with list of valid methods)
const routes = {
    // Auth
    login: {
        path: '/auth/login',
        method: 'POST',
        name: 'login',
        validations: {
            fields:  {
                username: {
                    required: true,
                },
                password: {
                    required: true
                }
            },
        }
    },

    register: {
        path:'/auth/register',
        method: 'POST',
        name: 'register',
        validations: {
            fields:  {
                username: {
                    required: true,
                },
                password: {
                    required: true
                }
            },
        }
    },

    // Users
    listUsers: {
        path:'/user',
        method: 'GET',
        name: 'listUsers'
    },

    getUser: {
        path:'/user/:userId',
        method: 'GET',
        name: 'getUser'
    },

    patchUser: {
        path:'/user/:userId',
        method: 'PATCH',
        name: 'patchUser',
        validations: {
            fields:  {
                username: {
                    patchable: true,
                }
            },
        }
    },

    deleteUser: {
        path:'/user/:userId',
        method: 'DELETE',
        name: 'deleteUser'
    }
}


const validations = {

    // Login route config
    [routes.login.name]: {
        fields: {
            username: {
                required: true
            },
            password: {
                required: true
            }
        }
    },

    // Register route config
    [routes.register.name]: {
        fields: {
            required: ['username', 'password']
        }
    },

    // Get user route config
    [routes.getUser.name]: {

    },

    // List users route config
    [routes.listUsers.name]: {

    },

    // patch user route config
    [routes.patchUser.name]: {
        fields: {
            optional: ['username']
        }
    },

    // delete user route config
    [routes.deleteUser.name]: {

    }
}

exports.routes = routes
exports.validations = validations