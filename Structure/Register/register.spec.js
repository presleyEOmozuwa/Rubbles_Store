const { expect, it } = require('@jest/globals');
const bcrypt = require('bcrypt');
const { connect, clearDatabase, closeDatabase } = require('../../config/connector');
const { stripeCustomer } = require('./register-helper');
const LocationTracker = require('../Models/location-tracker-model');
const User = require('../Models/user-model');
const { Cart, SubCart, Order, OrderArchive, Subscription, SubArchive } = require('../Models/common-model');
const RefreshToken = require('../Models/refreshToken-model')
const DeletedUser = require('../Models/deleted-user-model');
const { deletedlist } = require('../MockData/deleted-user-mock-data');
const { userlist } = require('../MockData/user-mock-data');
const { locationlist } = require('../MockData/location-mock-data');
const { cartlist } = require('../MockData/cart-auth-mock.data');
const { subcartlist } = require('../MockData/cart-sub.mock.data');
const { orderlist } = require('../MockData/order.mock.data');
const { orderArchivelist } = require('../MockData/order-archive-mock-data');
const { subscriptionlist } = require('../MockData/sub-mock-data');
const { subArchivelist } = require('../MockData/sub-archive-mock-data');
const { refreshtokenlist } = require('../MockData/refreshtoken-mock-data');
const app = require('../../app');
const request = require('supertest');
const nock = require('nock');


jest.mock('./register-helper');

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());


describe("POST /api/register", () => {
    it("should return status code 400 when payload is empty", async () => {

        const { body, statusCode } = await request(app).post('/api/register').send({
            payload: {}
        });

        expect(body.error).toEqual("please provide required fields")
        expect(statusCode).toBe(400);
    })

    it("should return status code 400 when username validation fails", async () => {
        const { body, statusCode } = await request(app).post('/api/register').send({
            payload: {
                username: "Lex",
                email: "alexisomozuwa@gmail.com",
                password: "Cook3400",
                terms: true
            }
        });

        expect(body.error).toEqual('"username" length must be at least 6 characters long')
        expect(statusCode).toBe(400);
    })

    it("should return status code 400  when user's provided email is associated with a deleted account", async () => {

        await DeletedUser.create(deletedlist);

        const { body, statusCode } = await request(app).post('/api/register').send({
            payload: {
                username: "Lexy82",
                email: "alexisomozuwa@gmail.com",
                password: "Cook3400",
                terms: true
            }
        });

        expect(body.error).toEqual("email cannot be used for registration, it is associated to a deleted account")
        expect(statusCode).toBe(400);
    })

    it("should return status code 400 when user's provided email already exist on the database", async () => {

        await DeletedUser.create(deletedlist);
        await User.create(userlist);

        const { body, statusCode } = await request(app).post('/api/register').send({
            payload: {
                username: "taylor87",
                email: "taylorswift@gmail.com",
                password: "Took3400",
                terms: true
            }
        });

        expect(body.error).toEqual("email already in use");
        expect(statusCode).toBe(400);

    })

    it("should return 404 when password hashing fails", async () => {

        await DeletedUser.create(deletedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => null);

        const { body, statusCode } = await request(app).post('/api/register').send({
            payload: {
                username: "Hensley85",
                email: "hensleyomozuwa@gmail.com",
                password: "Hook3400",
                terms: true
            }
        });

        expect(body.error).toEqual("password hashing failed")
        expect(statusCode).toBe(400);

    })

    it("should return status code 400 when user", async () => {

        await DeletedUser.create(deletedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("hash#hensley002");

        stripeCustomer.mockResolvedValueOnce({ id: "customer" })

        jest.spyOn(User, 'create').mockImplementationOnce(() => null);

        const { body, statusCode } = await request(app).post('/api/register').send({
            payload: {
                username: "Hensley85",
                email: "hensleyomozuwa@gmail.com",
                password: "Hook3400",
                terms: true
            }
        });

        expect(body.error).toEqual("Sorry, try again later")
        expect(statusCode).toBe(400);

    })


    it("should return status code 200 when user is successfully registered", async () => {

        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        await LocationTracker.create(locationlist);
        await Cart.create(cartlist);
        await SubCart.create(subcartlist);
        await RefreshToken.create(refreshtokenlist);
        await Order.create(orderlist);
        await OrderArchive.create(orderArchivelist);
        await Subscription.create(subscriptionlist);
        await SubArchive.create(subArchivelist);

        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("hash#hensley002");

        stripeCustomer.mockResolvedValueOnce({ id: "customer" })

        const { body, statusCode, } = await request(app).post('/api/register').send({
            payload: {
                username: "Hensley85",
                email: "hensleyomozuwa@gmail.com",
                password: "Hook3400",
                terms: true
            }
        });
        
        console.log(body);
        console.log(statusCode);
    })

    // it("should return status 200 when email confirmation link sent to user via an email server is successful", async () => {

    //     await DeletedUser.create(deletedlist);
    //     await User.create(userlist);

    //     jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("hash#hensley002");

    //     stripeCustomer.mockImplementationOnce((email) => {
    //         const customer = {
    //             id: "stripe005"
    //         };
    //         const scope = nock('https://api.stripe.com')
    //         scope.post('/v1/customers', email)
    //             .reply(200, customer)
    //         return customer;
    //     })

    //     const { body, statusCode } = await request(app).post('/api/register').send({
    //         payload: {
    //             username: "Hensley85",
    //             email: "hensleyomozuwa@gmail.com",
    //             password: "Hook3400",
    //             terms: true
    //         }
    //     });
        
    //     console.log(body)
    //     console.log(statusCode)

    // })

})