const mongoose = require('mongoose'); 
const { Schema, model } = mongoose;

const deletedUserSchema = new Schema({
    userId:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    username:{
        type: String,
        required: true
    }
}, { timestamps: true});

const DeletedUser = model('DeletedUser', deletedUserSchema);

module.exports = DeletedUser;