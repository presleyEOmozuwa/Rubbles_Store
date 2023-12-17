const mongoose = require('mongoose'); 
const { Schema, model } = mongoose;

const oldUserEmailSchema = new Schema({
    email:{
        type: String,
        unique: true,
        default: "email"
    },
    role:{
        type: String,
        default: "client"
    }
}, { timestamps: true});

const OldUserEmail = model('OldUserEmail', oldUserEmailSchema);

module.exports = OldUserEmail;