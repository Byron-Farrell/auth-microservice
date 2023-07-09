const authControllers = require("../controllers/authControllers");
const userControllers = require("../controllers/userControllers");

// TODO: unit test to test methid field is correct (compare with list of valid methods)
const routes = {
    // Auth
    login: { path: '/auth/login', method: 'POST', name: 'login' },
    register: { path:'/auth/register', method: 'POST', name: 'register' },

    // Users
    listUsers: { path:'/user', method: 'GET', name: 'listUsers' },
    getUser: { path:'/user/:userId', method: 'GET', name: 'getUser' },
    patchUser: { path:'/user/:userId', method: 'PATCH', name: 'patchUser' },
    deleteUser: { path:'/user/:userId', method: 'DELETE', name: 'deleteUser' }
}

const validations = {

    [routes.login.name]: {
        fields: {
            required: ['username', 'password']
        }
    },

    [routes.register.name]: {
        fields: {
            required: ['username', 'password']
        }
    },

    [routes.getUser.name]: {
        fields: {
            required: []
        }
    },

    [routes.listUsers.name]: {
        fields: {
            required: []
        }
    },

    [routes.patchUser.name]: {
        fields: {
            required: []
        }
    },

    [routes.deleteUser.name]: {
        fields: {
            required: []
        }
    }
}

exports.routes = routes
exports.validations = validations