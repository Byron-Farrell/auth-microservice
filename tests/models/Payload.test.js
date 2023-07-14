const Payload = require('../../src/utility/Payload')
describe('Payload model', () => {

    test('success field should exist', () => {
        const payload = new Payload(true, 'message')

        expect(payload.success).toBeDefined()
    })

    test('success field should be equal to true', () => {
        const payload = new Payload(true, 'message')

        expect(payload.success).toBe(true)
    })

    test('success field should be equal to false', () => {
        const payload = new Payload(false, 'message')

        expect(payload.success).toBe(false)
    })

    test('message field should exist', () => {
        const payload = new Payload(true, 'message')

        expect(payload.message).toBeDefined()
    })

    test('success field should be equal to "Test Message"', () => {
        const payload = new Payload(true, 'Test Message')

        expect(payload.message).toBe('Test Message')
    })


    test('Errors should exists when addError is called', () => {
        const payload = new Payload(true, 'message')
        payload.addError('field', 'error message')
        expect(payload.payload.errors).toBeDefined()
    })

    test('payload.errors array length should equal 1', () => {
        const payload = new Payload(true, 'message')
        payload.addError('field', 'error message')
        expect(payload.payload.errors.length).toBe(1)
    })

    test('payload.errors array field and message fields should be defined', () => {
        const payload = new Payload(true, 'message')
        payload.addError('field', 'error message')
        expect(payload.payload.errors[0].field).toBeDefined()
        expect(payload.payload.errors[0].message).toBeDefined()
    })

    test('payload.errors array field and message fields should be assigned correct values', () => {
        const payload = new Payload(true, 'message')
        payload.addError('field', 'error message')
        expect(payload.payload.errors[0].field).toBe('field')
        expect(payload.payload.errors[0].message).toBe('error message')
    })

    test('payload.data should be defined', () => {
        const payload = new Payload(true, 'message', 1)
        expect(payload.payload.data).toBeDefined()
    })

    test('payload.data should be equal 1', () => {
        const payload = new Payload(true, 'message', 1)
        expect(payload.payload.data).toBe(1)
    })
})