const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../src/app')
const User = require('../../src/models/User')
const authConfig = require('../../src/config/auth')

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

    test('User password should be encrypted', async () => {

        const newUser = {
            username: 'sarah',
            password: 'password123'
        }

        await request(app)
            .post('/auth/register')
            .send(newUser)
            .expect(201)

        const user = await User.findOne({username: 'sarah'})
        const match = await bcrypt.compare(newUser.password, user.password)

        expect(user.password).toBeDefined()
        expect(match).toStrictEqual(true)
    })

    test('User already exists', async () => {
        const user1 = {
            username: 'username',
            password: 'password123'
        }

        const user2 = {
            username: 'username',
            password: 'password123'
        }

        await request(app)
            .post('/auth/register')
            .send(user1)
            .expect(201)

        await request(app)
            .post('/auth/register')
            .send(user2)
            .expect(409)
            .expect('Content-Type', /json/)
            .then(response => {
                const data = JSON.parse(response.text)
                expect(data.message).toBe('Username Already exists')
            })
    })
})

describe('Login', () => {

    const user = {
        username: 'bob',
        password: 'password123'
    }

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test')

        await request(app)
            .post('/auth/register')
            .send(user)
    })

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.disconnect()
    })

    test('Successful login', async () => {

        await request(app)
            .post('/auth/login')
            .send(user)
            .expect(200)
    })

    test('Missing username field', () => {
        return request(app)
            .post('/auth/login')
            .send({password: user.password})
            .expect(404)
            .expect('Content-Type', /json/)
            .then(response => {
                const data = JSON.parse(response.text)
                const errorFields = data.payload.errors.map(error => error.field)
                expect(errorFields).toContain('username')
            })
    })

    test('Missing password field', () => {
        return request(app)
            .post('/auth/login')
            .send({username: user.username})
            .expect(404)
            .expect('Content-Type', /json/)
            .then(response => {
                const data = JSON.parse(response.text)
                const errorFields = data.payload.errors.map(error => error.field)
                expect(errorFields).toContain('password')
            })
    })

    test('Incorrect password', () => {
        return request(app)
            .post('/auth/login')
            .send({username: user.username, password: 'wrong_password'})
            .expect(401)
            .expect('Content-Type', /json/)
            .then(response => {
                const data = JSON.parse(response.text)
                const errorFields = data.payload.errors.map(error => error.field)
                expect(errorFields).toContain('password')
            })
    })

    test('Username does not exists', () => {
        return request(app)
            .post('/auth/login')
            .send({username: 'user_does_not_exist', password: user.password})
            .expect(404)
            .expect('Content-Type', /json/)
            .then(response => {
                const data = JSON.parse(response.text)
                const errorFields = data.payload.errors.map(error => error.field)
                expect(errorFields).toContain('username')
            })
    })

    test('Receive valid token', () => {
        return request(app)
            .post('/auth/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                const data = JSON.parse(response.text)
                const token = data.payload.data
                console.log(data)
                jwt.verify(token, authConfig.JWT_SECRET_KEY, (error, decoded)=> {
                    expect(error).toBeFalsy()
                })
            })
    })
})