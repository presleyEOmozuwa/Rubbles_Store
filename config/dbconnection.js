const mongoose = require('mongoose');
require('dotenv').config({path: "./vars/.env"});

const dbconnect = async () => {
    try{
        mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})
        console.log("connected to mongodb server")
    }
    catch(err){
        console.log(err.message);
    }
}


module.exports = dbconnect;
