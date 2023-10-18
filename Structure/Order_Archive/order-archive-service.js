const { OrderArchive } = require('../Models/common-model');

const getOrderArchive = async (userId) => {
    const orderArchive = await OrderArchive.findOne({userId: userId});
    return orderArchive;
}


const retrieveOrderArchive = async (userId) => {
    const orderArchive = await OrderArchive.findOne({userId: userId});

    if(!orderArchive){
        throw new Error("order archive not found");
    }
    
    return orderArchive;
}


module.exports = { getOrderArchive, retrieveOrderArchive }