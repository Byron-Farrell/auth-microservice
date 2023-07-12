// TODO: unit test to test method field is correct (compare with list of valid methods)
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
};


exports.routes = routes;
