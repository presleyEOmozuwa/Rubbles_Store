const mongoose = require('mongoose'); 
const { Schema, model } = mongoose;

const locationTrackerSchema = new Schema({
    userId:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    locationId:{
        type: String,
        required: true
    }
}, { timestamps: true});

const LocationTracker = model('LocationTracker', locationTrackerSchema);

module.exports = LocationTracker;