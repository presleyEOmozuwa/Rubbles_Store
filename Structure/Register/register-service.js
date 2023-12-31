const express = require('express');
require('dotenv').config({ path: "../../vars/.env" });
const bcrypt = require('bcrypt');
const User = require('../Models/user-model');
const DeletedUser = require('../Models/deleted-user-model');
const { validationSchema } = require('../Utils/register-validation-utils');
const { stripeCustomer } = require('./register-helper');
const { objCheckerOne, objCheckerTwo } = require('../Utils/obj-checker-utils');

const register = async (payload) => {
    let con = {};

    if (!payload || objCheckerOne(payload) === 0) {
        throw new Error("data not found");
    }


    // VALIDATE USER DATA
    const { error, value } = validationSchema.validate(payload);

    if (error) {
        throw new Error(error.message);
    }


    if (value) {
        const deleteUser = await DeletedUser.findOne({ email: value.email });
        
        if (deleteUser && objCheckerTwo(deleteUser) > 0) {
            throw new Error("email cannot be used, account closed");
        }

        const user = await User.findOne({ email: value.email });
        if (user && objCheckerTwo(user) > 0) {
            throw new Error("email already in use");
        }


        const hashedPassword = await bcrypt.hash(value.password, 10)

        if (!hashedPassword) {
            throw new Error("client password hash unsuccessful");
        }

        // CREATE CLIENT ON STRIPE
        const customer = await stripeCustomer(value.email);

        // CREATE CLIENT ACCOUNT
        const normalUser = await User.create({
            username: value.username,
            email: value.email,
            password: hashedPassword,
            role: "client",
            stripecustomerid: customer.id,
            terms: value.terms
        });


        if (!normalUser || objCheckerOne(normalUser) === 0) {
            throw new Error("normal registration failed");
        }

        con.normalUser = normalUser;

    }

    return con;
}


module.exports = { register, stripeCustomer };