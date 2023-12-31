const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connect = async () => {
    try {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const options = {
            useNewUrlParser: true
        };
        await mongoose.connect(uri, options);
    }
    catch (err) {
        console.log(err.message);
    }
}

const clearDatabase = async () => {
    try {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
    catch (err) {
        console.log(err.message);
    }
}

const closeDatabase = async () => {
    try {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongod.stop();
    }
    catch (err) {
        console.log(err.message);
    }
}


module.exports = { connect, clearDatabase, closeDatabase, }