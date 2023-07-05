const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../../src/app')
const User = require('../../src/models/User')

describe('Get user list', () => {

    let token = null

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/getUserListTest')
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
        await mongoose.connect('mongodb://localhost:27017/getUserByIdTest')
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

    test('Response code should be 200', () => {

        return request(app)
            .get(`/user/${user1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200) // Response status code should be 200 (successful)
    })

    test('Correct user in response', () => {

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



describe('Delete user by ID', () => {

    let token = null
    let user1 = null

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/deleteUserByIdTest')
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

    test('Incorrect user id', () => {
        return request(app)
            .delete('/user/646a10d20af237cd0189e700')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(404)
    })

    test('Invalid user id type', () => {
        return request(app)
            .delete('/user/123')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(400)
    })

    test('User deleted successfully. Response code should be 204', () => {

        return request(app)
            .delete(`/user/${user1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    })

    test('User should be not be in database', async () => {
        let deletedUser = await User.findOne({_id: user1.id})

        expect(deletedUser).toBeNull()
    })
})

describe('Patch user by ID', () => {

    let token = null
    let user1 = null

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/patchUserByIdTest')
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

    test('Incorrect user id', () => {
        return request(app)
            .patch('/user/646a10d20af237cd0189e700')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(404)
    })

    test('Invalid user id type', () => {
        return request(app)
            .patch('/user/123')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(400)
    })

    test('Invalid user id type', () => {
        return request(app)
            .get('/user/123')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(400)
    })

    test('Update username successfully', async () => {

        const newUsername = 'newUsername'
        await request(app)
            .patch(`/user/${user1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({username: newUsername})
            .expect(204)

        const patchedUser = await User.findOne({_id: user1.id})

        expect(patchedUser).toBeTruthy()
        expect(patchedUser.username).toBeDefined()
        expect(patchedUser.username).toStrictEqual(newUsername.toLowerCase())
    })

    test('Updated username already exists', () => {
        const newUsername = 'user2'
        return request(app)
            .patch(`/user/${user1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({username: newUsername})
            .expect(409)
    })

    test('Should not be allowed to patch password', async () => {

        await request(app)
            .patch(`/user/${user1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({password: 'newPassword'})
            .expect(405) // Not allowed

        const user = await User.findOne({_id: user1.id})

        expect(user).toBeTruthy()
        expect(user.comparePasswords('123')).toBeTruthy()
    })
})
