const mongoose = require('mongoose')
const User = require('../../src/models/User')
const request = require('supertest')
const app = require('../../src/app')

describe('Test token validation middleware', () => {

    let token = null
    let user1 = null

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/authMiddlewareTest')
        user1 = new User({username: 'user1', password: '123'})
        await user1.save()

        token = await user1.generateToken()
    })

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.disconnect()
    })

    test('Response code should be 200', () => {

        return request(app)
            .get(`/user/${user1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200) // Response status code should be 200 (successful)
    })

    test('Response code should be 401', () => {

        return request(app)
            .get(`/user/${user1.id}`)
            .expect('Content-Type', /json/)
            .expect(401)
    })

})

