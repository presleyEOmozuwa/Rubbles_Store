const { expect, it } = require('@jest/globals');
const bcrypt = require('bcrypt');
const { connect, clearDatabase, closeDatabase } = require('../../config/connector');
const { register } = require('./register-service');
const { stripeCustomer } = require('./register-helper');
const LocationTracker = require('../Models/location-tracker-model');
const User = require('../Models/user-model');
const { Cart } = require('../Models/common-model');
const DeletedUser = require('../Models/deleted-user-model');
const { deletedlist } = require('../MockData/deleted-user-mock-data');
const { userlist } = require('../MockData/user-mock-data');
const { locationlist } = require('../MockData/location-mock-data');
const { cartlist } = require('../MockData/cart-auth-mock.data');
const { locationTracker } = require('../Utils/user-utils');
const { assignCartToUser } = require('../Utils/cart-util');


jest.mock('bcrypt');
jest.mock('./register-helper');

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());


describe("Register.js", () => {
    it("should throw an error when payload is empty", async () => {
        expect(async () => await register({})).rejects.toThrow("data not found");
    })

    it("should throw an error when username validation fails", async () => {
        const payload = {
            username: "Lex",
            email: "alexisomozuwa@gmail.com",
            password: "Cook3400",
            terms: true
        }
        expect(async () => await register(payload)).rejects.toThrow();
    })

    it("should throw an error when user's provided email is associated with a deleted account", async () => {
        const payload = {
            username: "Lexy82",
            email: "alexisomozuwa@gmail.com",
            password: "Cook3400",
            terms: true
        }
        await DeletedUser.create(deletedlist);
        
        expect(async () => await register(payload)).rejects.toThrow("email cannot be used, account closed")
    })

    it("should throw an error when user provided email already exist on the database", async () => {
        const payload = {
            username: "Taylor87",
            email: "taylorswift@gmail.com",
            password: "Took3400",
            terms: true
        }
        await DeletedUser.create(deletedlist);
        await User.create(userlist);
        expect(async () => await register(payload)).rejects.toThrow("email already in use");
    })

    it("should throw an error when user's password hashing fails", async () => {
        const payload = {
            username: "Hensley85",
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400",
            terms: true
        }

        await DeletedUser.create(deletedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(null);

        expect(async () => await register(payload)).rejects.toThrow("client password hash unsuccessful"); 
    
    })

    it("should throw an error when inserting user into the database fails", async () => {
        const payload = {
            username: "Hensley85",
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400",
            terms: true
        }

        await DeletedUser.create(deletedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("hash#hensley002");

        stripeCustomer.mockResolvedValueOnce({ id: "stripeFive" })

        jest.spyOn(User, 'create').mockResolvedValueOnce(null);

        expect(async () => await register(payload)).rejects.toThrow("normal registration failed");

    })

    it("should register a new user", async () => {
        const payload = {
            username: "Hensley85",
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400",
            terms: true
        }

        await DeletedUser.create(deletedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("hash#hensley002");
        
        stripeCustomer.mockResolvedValueOnce({ id: "stripeFive" })

        await register(payload);

        const users = await User.find();
        expect(users.length).toBe(5)

    })

    it("should save user's session id info on database", async () => {
        const payload = {
            username: "Hensley85",
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400",
            terms: true
        }

        await DeletedUser.create(deletedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("hash#hensley002");
        
        stripeCustomer.mockResolvedValueOnce({ id: "stripeFive" })

        const sessionId = "session005";
        const user = await register(payload);

        await LocationTracker.create(locationlist);
        await locationTracker(user.normalUser, sessionId)
        
        const locations = await LocationTracker.find();
        expect(locations.length).toBe(3)

    })

    it("should assign a shopping cart to a registered user", async () => {
        const payload = {
            username: "Hensley85",
            email: "hensleyomozuwa@gmail.com",
            password: "Hook3400",
            terms: true
        }

        await DeletedUser.create(deletedlist);
        await User.create(userlist);

        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("hash#hensley002");
        
        stripeCustomer.mockResolvedValueOnce({ id: "stripeFive" })

        const user = await register(payload);
        await Cart.create(cartlist);
        
        const assignedCart = await assignCartToUser(user.normalUser);
        
        const list = await Cart.find()
        
        expect(list.length).toBe(3);
        expect(assignedCart.userId).toEqual(user.normalUser._id);
    })
})