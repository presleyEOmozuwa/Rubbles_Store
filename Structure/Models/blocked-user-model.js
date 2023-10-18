const mongoose = require('mongoose'); 
const { Schema, model } = mongoose;

const blockedUserSchema = new Schema({
    userId:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    role:{
        type: String,
        required: true,
        default: "Client"
    }
}, { timestamps: true});

const BlockedUser = model('BlockeUser', blockedUserSchema);

module.exports = BlockedUser;