const { SubCart } = require('../Models/common-model');

const getSubCart = async (userId) => {
    const subcart = await SubCart.findOne({userId: userId});
    return subcart;
}

const retrieveSubCart = async (userId) => {
    const subcart = await SubCart.findOne({userId: userId});
    
    if(!subcart){
        throw new Error("subcart not found");
    }
    
    return subcart;
}

const retrieveSubCartPlus = async (userId) => {
    const subcart = await SubCart.findOne({userId: userId}).populate({ path: 'subitems', populate: 'categories'});
    
    if(!subcart){
        throw new Error("subcart not found");
    }
    
    return subcart;
}


module.exports = { getSubCart, retrieveSubCart, retrieveSubCartPlus }