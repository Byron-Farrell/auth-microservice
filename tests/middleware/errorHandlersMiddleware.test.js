const mongoose = require('mongoose');
const User = require('../../src/models/User');
const request = require('supertest');
const app = require('../../src/app');

describe('Test JSON error handler', () => {

    let token = null;
    let user1 = null;

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/errorHandlerMiddlewareTest');
        user1 = new User({username: 'user1', password: '123'});
        await user1.save();

        token = await user1.generateToken();
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.disconnect();
    });

    test('Return 400 when for malformed JSON in requested body', async () => {

        const newUsername = 'newUsername'
        await request(app)
            .patch(`/user/${user1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send('{"username": "newUsername"},bug')
            .expect(400)
    })
});

