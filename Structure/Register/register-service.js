const express = require('express');
require('dotenv').config({ path: "../../vars/.env" });
const bcrypt = require('bcrypt');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const User = require('../Models/user-model');
const DeletedUser = require('../Models/deleted-user-model');
const { validationSchema } = require('../Utils/register-validation-utils');


const register = async (payload) => {
    let con = {};

    if (!payload) {
        throw new Error("data not found");
    }

    // VALIDATE USER DATA
    const { error, value } = validationSchema.validate(payload);

    if (error) {
        throw new Error(error.message);
    }

    if (value) {
        const deleteUser = await DeletedUser.findOne({ email: value.email });

        if(deleteUser) {
            throw new Error("email cannot be used, account closed");
        }
        
        const user = await User.findOne({ email: value.email });

        if (user) {
            throw new Error("email already in use");
        }

        let hashedPassword = await bcrypt.hash(value.password, 10)

        if (!hashedPassword) {
            throw new Error("client password hash unsuccessful");
        }

        // CREATE CLIENT ON STRIPE
        const customer = await stripe.customers.create({
            email: value.email
        });

        const temp = {
            username: value.username,
            email: value.email,
            password: hashedPassword,
            role: "client",
            stripecustomerid: customer.id,
            terms: value.terms
        }


        // CREATE CLIENT ACCOUNT
        const normalUser = await User.create(temp);

        if (!normalUser) {
            throw new Error("normal registration failed");
        }

        con.normalUser = normalUser;
    
    }
    
    return con;
}



module.exports = { register };