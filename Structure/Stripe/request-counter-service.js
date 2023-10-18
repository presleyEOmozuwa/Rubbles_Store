
const RequestCounter = require('../Models/request-counter-model');

const getRequestCounter = async (userId) => {
    const reqCounter = await RequestCounter.findOne({userId: userId});
    return reqCounter;
}

const retrieveRequestCounter = async (userId) => {
    const reqCounter = await RequestCounter.findOne({userId: userId});

    if(!reqCounter){
        throw new Error("request counter not found");
    }

    return reqCounter;
}

const resetRequestCounter = async (user) => {
    const reqCounter = await retrieveRequestCounter(user._id);
    
}


module.exports = { getRequestCounter, retrieveRequestCounter }