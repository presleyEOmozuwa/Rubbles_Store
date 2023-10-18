const mongoose = require('mongoose');
require('dotenv').config({path: "./vars/.env"});

async function dbconnect() {
    mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true}).then(() => {
        console.log("Connected to Mongodb Server")
    }, (error) => console.log(error.message));
}


module.exports = dbconnect;
