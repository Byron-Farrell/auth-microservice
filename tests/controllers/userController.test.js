const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../../src/app')
const User = require('../../src/models/User')

describe('Get user list', () => {

    let token = null

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/userControllerTest')
        const user1 = new User({username: 'user1', password: '123'})
        const user2 = new User({username: 'user2', password: '123'})
        await user1.save()
        await user2.save()

        token = await user1.generateToken()
    })

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.disconnect()
    })

    test('Get all users', () => {
        // Send get request to retrieve all users.
        return request(app)
            .get('/user')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200) // Response status code should be 200 (successful)
            .then(response => {
                // Get response data
                const data = JSON.parse(response.text)
                // Counting how many users were returned
                const userCount = data.payload.data.length
                expect(userCount).toStrictEqual(2)

            })
    })
})

describe('Get user by ID', () => {

    let token = null
    let user1 = null
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/userControllerTest')
        user1 = new User({username: 'user1', password: '123'})
        const user2 = new User({username: 'user2', password: '123'})
        await user1.save()
        await user2.save()

        token = await user1.generateToken()
    })

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.disconnect()
    })

    test('Expect response code 200', () => {

        return request(app)
            .get(`/user/${user1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200) // Response status code should be 200 (successful)
    })

    test('Expect response code 200', () => {

        return request(app)
            .get(`/user/${user1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200) // Response status code should be 200 (successful)
            .then(response => {
                const data = JSON.parse(response.text)
                expect(data.payload.data).toBeDefined()
                expect(data.payload.data.id).toStrictEqual(user1.id)
                expect(data.payload.data.username).toStrictEqual(user1.username)
            })
    })

    test('Incorrect user id', () => {
        return request(app)
            .get('/user/646a10d20af237cd0189e700')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(404)
    })

    test('Invalid user id type', () => {
        return request(app)
            .get('/user/123')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(400)
    })
})