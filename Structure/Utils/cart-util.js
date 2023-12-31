const { getCart } = require('../Cart_AuthUser/cart-service');
const { Cart } = require('../Models/common-model');
const { objCheckerOne } = require('./obj-checker-utils');


const assignCartToUser = async (user) => {
    let createdCart;
    const cart = await getCart(user._id);
    if (!cart || objCheckerOne(cart) === 0) {
        createdCart = await Cart.create({
            userId: user._id
        })
    }
    else {
        throw new Error("user's cart already exist")
    }

    return createdCart;

}

const addProductToCart = async (cartId, product) => {
    await Cart.findByIdAndUpdate(
        cartId,
        { $addToSet: { products: [product._id] } },
        { new: true }
    );
}

const removeProductFromCart = async (cartId, product) => {
    await Cart.findByIdAndUpdate(
        cartId,
        { $pullAll: { products: [product._id] } },
        { new: true }
    );
}

const transferSessionProductsToCart = async (cartId, sessionProduct) => {
    await Cart.findByIdAndUpdate(
        cartId,
        { $addToSet: { products: [sessionProduct._id] } },
        { new: true }
    );
}

const sessionProductshandler = async (products, normalUser) => {
    if (products) {
        products.forEach(async (product) => {
            const cart = await retrieveCart(normalUser._id);
            await transferSessionProductsToCart(cart._id, product);
        })
    }
}



module.exports = { assignCartToUser, addProductToCart, removeProductFromCart, sessionProductshandler }