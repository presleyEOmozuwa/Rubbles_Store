const { Cart } = require('../Models/common-model');

const getCart = async (userId) => {
    const cart = await Cart.findOne({userId: userId});
    return cart;
}

const retrieveCart = async (userId) => {
    const cart = await Cart.findOne({userId: userId});
    
    if(!cart){
        throw new Error("cart not found");
    }
    
    return cart;
}

const retrieveCartPlus = async (userId) => {
    const cart = await Cart.findOne({userId: userId}).populate('products');
    
    if(!cart){
        throw new Error("cart not found");
    }
    
    return cart;
}


module.exports = { getCart, retrieveCart, retrieveCartPlus }