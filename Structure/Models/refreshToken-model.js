const mongoose = require('mongoose'); 
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const refreshTokenSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', required: true },
    
    refreshtoken: {
        type: String,
        default: "refresh token",
        unique: true
    }

}, { timestamps: true});

const RefreshToken = model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken