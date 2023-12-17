const mongoose = require('mongoose'); 
const { Schema, model } = mongoose;

const locationTrackerSchema = new Schema({
    userId:{
        type: String,
        default: "userId"
    },
    email:{
        type: String,
        default: "email"
    },
    locationId:{
        type: String,
        default: "locationId"
    }
}, { timestamps: true});

const LocationTracker = model('LocationTracker', locationTrackerSchema);

module.exports = LocationTracker;