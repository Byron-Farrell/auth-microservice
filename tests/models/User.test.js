const request = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const authConfig = require('../../src/config/auth')
const User = require('../../src/models/User')

describe('User model', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/userModelTest')
    })

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.disconnect()
    })

    test('User creation', async () => {

        const user = new User({username: 'username', password: 'password123'})

        expect(user).toBeTruthy()

        expect(user._id).toBeDefined()
        expect(user.username).toBeDefined()
        expect(user.username).toStrictEqual('username')
        expect(user.password).toBeDefined()
        expect(user.password).toStrictEqual('password123')
    })

    test('Password hashed after save', async () => {
        const user = new User({username: 'hashMyPassword', password: 'password123'})
        await user.save()
        const match = await bcrypt.compare('password123', user.password)
        expect(match).toBeTruthy()
    })

    test('User saved into database', async () => {
        const user = new User({username: 'bob', password: 'password123'})

        expect(user).toBeTruthy()

        await user.save()

        const userExists = User.findOne({_id: user.id})

        expect(userExists).toBeTruthy()
    })

    test('User exists static method', async () => {
        const user = new User({username: 'jim', password: 'password123'})
        const list = await User.find()
        expect(user).toBeTruthy()
        await user.save()

        const userExists = await User.exists(user.username)
        expect(userExists).toBeTruthy()
        expect(userExists).toBe(true)
    })

    test('User does not exist', async () => {
        const userExists = await User.exists('user_does_not_exist')
        expect(userExists).toBeFalsy()
        expect(userExists).toBe(false)
    })

    test('Generate valid JSON web token', async () => {
        const user = new User({username: 'linda', password: 'password123'})
        const token = await user.generateToken()

        const validToken = jwt.verify(token, authConfig.JWT_SECRET_KEY)

        expect(validToken).toBeTruthy()
    })

    test('comparePasswords method should return true', async () => {
        const user = new User({username: 'han', password: '123'})

        await user.save()

        const match = await user.comparePasswords('123')

        expect(match).toBeTruthy()
    })

    test('comparePasswords method should return false', async () => {
        const user = new User({username: 'solo', password: '123'})

        await user.save()

        const match = await user.comparePasswords('abc')

        expect(match).toBeFalsy()
    })

})