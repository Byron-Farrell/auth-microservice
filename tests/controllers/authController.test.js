const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../../src/app')
const User = require('../../src/models/User')



describe('Register user', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test')
    })

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.disconnect()
    })

    test('Should receive a status code 201 when a user is registered', () => {
        const newUser = {
            username: 'bob',
            password: 'password123'
        }

        return request(app)
            .post('/auth/register')
            .send(newUser)
            .expect(201)
    })

    test('User should exist in database', async () => {
        const newUser = {
            username: 'john',
            password: 'password123'
        }

        await request(app)
            .post('/auth/register')
            .send(newUser)

        const user = await User.findOne({username: 'john'})

        expect(user).toBeTruthy()
    })

    test('Username should be stored in User object', async () => {
        const newUser = {
            username: 'jim',
            password: 'password123'
        }

        await request(app)
            .post('/auth/register')
            .send(newUser)

        const user = await User.findOne({username: 'jim'})

        expect(user.username).toBeDefined()
        expect(user.username).toStrictEqual('jim')

    })
})