const mongoose = require('mongoose');
const User = require('../../src/models/User');
const request = require('supertest');
const app = require('../../src/app');

const { routes, validations } = require('../../src/routes/routesConfig');

describe('Test validation middleware', () => {

	let user1 = null;
    let token = null;

	beforeAll(async () => {
		await mongoose.connect('mongodb://localhost:27017/validationMiddlewareTest');
		user1 = new User({username: 'user1', password: '123'});
		await user1.save();
        token = await user1.generateToken();
	});

	afterAll(async () => {
		await User.deleteMany({});
		await mongoose.disconnect();
	});

    test('Expecting 404. Missing username in login request', async () => {

        await request(app)
            .post(`/auth/login`)
            .set('Content-Type', 'application/json')
            .send('{"password": "123"}')
            .expect(404)
            .then(response => {

                const data = JSON.parse(response.text)
                expect(data.success).toBeFalsy()
                const usernameFieldMissing = data.payload.errors.filter(error => error.field === 'username')
                const usernameIsMissing = usernameFieldMissing.length > 0
                expect(usernameIsMissing).toBeTruthy()
            })
    });

    test('Expecting 404. Missing password in login request', async () => {

        await request(app)
            .post(`/auth/login`)
            .set('Content-Type', 'application/json')
            .send('{"username": "user1"}')
            .expect(404)
            .then(response => {
                const data = JSON.parse(response.text)
                const passwordFieldMissing = data.payload.errors.filter(error => error.field === 'password')
                const passwordIsMissing = passwordFieldMissing.length > 0
                expect(passwordIsMissing).toBeTruthy()
            })
    });

    test('Expecting 404. Missing username in register request', async () => {

        await request(app)
            .post(`/auth/register`)
            .set('Content-Type', 'application/json')
            .send('{"password": "123"}')
            .expect(404)
            .then(response => {
                const data = JSON.parse(response.text)
                expect(data.success).toBeFalsy()
                const usernameFieldMissing = data.payload.errors.filter(error => error.field === 'username')
                const usernameIsMissing = usernameFieldMissing.length > 0
                expect(usernameIsMissing).toBeTruthy()
            })
    });

    test('Missing password in register request', async () => {

        await request(app)
            .post(`/auth/register`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send('{"username": "user2"}')
            .expect(404)
            .then(response => {
                const data = JSON.parse(response.text)
                const passwordFieldMissing = data.payload.errors.filter(error => error.field === 'password')
                const passwordIsMissing = passwordFieldMissing.length > 0
                expect(passwordIsMissing).toBeTruthy()
            })
    });

    test('Password is not allowed in request body', async () => {

        await request(app)
            .patch(`/user/${user1.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send('{"password": "123"}')
            .expect(405)
            .then(response => {
                const data = JSON.parse(response.text)
                const passwordErrorField = data.payload.errors.filter(error => error.field === 'password')
                const passwordError = passwordErrorField.length > 0
                expect(passwordError).toBeTruthy()
            })
    });

    test('Invalid is not allowed in request body', async () => {

        await request(app)
            .patch(`/user/${user1.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send('{"field1": "1", "field2": "2", "field3": "3"}')
            .expect(405)
            .then(response => {
                const data = JSON.parse(response.text)
                const invalidFields = data.payload.errors.filter(error => error.field.substring(0, 5) === 'field')
                expect(invalidFields.length === 3).toBeTruthy()
            })
    });

    test('Empty body not allowed in patch', async () => {
        await request(app)
            .patch(`/user/${user1.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    });
});

