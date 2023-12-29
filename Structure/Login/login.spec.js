const { expect, it } = require('@jest/globals');
const bcrypt = require('bcrypt');
const { connect, clearDatabase, closeDatabase } = require('../../config/connector');
const app = require('../../app');
const request = require('supertest');
const nock = require('nock')
const User = require('../Models/user-model');
const DeletedUser = require('../Models/deleted-user-model');
const BlockedUser = require('../Models/blocked-user-model');
const LocationTracker = require('../Models/location-tracker-model');
const { deletedlist } = require('../MockData/deleted-user-mock-data');
const { blockedlist } = require('../MockData/block-mock-data');
const { userlist } = require('../MockData/user-mock-data');
const { locationlist } = require('../MockData/location-mock-data');
const { authenticator } = require('otplib');

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe("POST /api/login/payload", () => {
    it("should return 404 when email or password is not provided", async () => {

        const { body, statusCode } = await request(app).post('/api/login/payload').send({
            email: "hensleyomozuwa@gmail",
            password: null
        })

        expect(body.error).toEqual("email and password fields are required")
        expect(statusCode).toBe(400);
    })


    it("should return 404 when user's provided email is associated to a closed account", async () => {

        await DeletedUser.create(deletedlist);
        const { body, statusCode } = await request(app).post('/api/login/payload').send({
            email: "alexisomozuwa@gmail.com",
            password: "Cook3400"
        })

        expect(body.error).toEqual("email is associated to a closed account")
        expect(statusCode).toBe(400);

    })

    it("should return 404 when user's provided email is associated to a blocked account", async () => {

        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);

        const { body, statusCode } = await request(app).post('/api/login/payload').send({
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400"
        })

        expect(body.error).toEqual("email is associated to a blocked account")
        expect(statusCode).toBe(400);

    })

    it("should return 404 when user's provided email cannot be found on the database", async () => {

        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);
        await User.create(userlist);


        const { body, statusCode } = await request(app).post('/api/login/payload').send({
            email: "smithblake@gmail.com",
            password: "Sook3400"
        })

        expect(body.error).toEqual("invalid email or password");
        expect(statusCode).toBe(400);

    })

    it("should return 400 when password hash validation fails", async () => {

        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);

        const { body, statusCode } = await request(app).post('/api/login/payload').send({
            email: "taylorswift@gmail.com",
            password: "Took3400"
        })

        expect(body.error).toEqual("invalid email or password");
        expect(statusCode).toBe(400);
    })

    it("should return 400 when OTP SECRET KEY generation returns no value", async () => {

        await DeletedUser.create(deletedlist);
        await BlockedUser.create(blockedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)

        jest.spyOn(authenticator, 'generateSecret').mockImplementationOnce(() => null);

        const { body, statusCode } = await request(app).post('/api/login/payload').send({
            email: "taylorswift@gmail.com",
            password: "Took3400"
        })

        expect(body.error).toEqual("otp secret key generation failed");
        expect(statusCode).toBe(400);
    })
})


it("should return status code 400 when One Time Password generation fails", async () => {

    await DeletedUser.create(deletedlist);
    await BlockedUser.create(blockedlist);
    await User.create(userlist);

    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)

    jest.spyOn(authenticator, 'generate').mockImplementationOnce(() => null);

    const { body, statusCode } = await request(app).post('/api/login/payload').send({
        email: "taylorswift@gmail.com",
        password: "Took3400"
    });
    
    expect(body.error).toEqual("otp failed");
    expect(statusCode).toBe(400);

    console.log(body)
    console.log(statusCode)
})

it.only("should generate jwt token, update its expiry time and returns status code 200 when user enables rememberMe and session id matches the one on the database", async () => {

    await DeletedUser.create(deletedlist);
    await BlockedUser.create(blockedlist);
    await User.create(userlist);
    jest.spyOn(LocationTracker, 'findOne').mockImplementationOnce(() => true)

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);

    const { body, statusCode } = await request(app).post('/api/login/payload').send({
        email: "taylorswift@gmail.com",
        password: "Took3400",
        rememberMe: "remember me",
        useToken: ""
    });
    
    console.log(body)
    console.log(statusCode)
})