const { getCart, retrieveCart } = require('../Cart_AuthUser/cart-service');
const { Cart } = require('../Models/common-model');
const { objCheckerOne, objCheckerTwo } = require('./obj-checker-utils');


const assignCartToUser = async (user) => {
    const cart = await getCart(user._id);
    if (!cart || objCheckerOne(cart) === 0) {
        const createdCart = await Cart.create({
            userId: user._id,
            email: user.email
        })
        return createdCart
    }
    return;
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
    const result = await Cart.findByIdAndUpdate(
        cartId,
        { $addToSet: { products: [sessionProduct._id] } },
        { new: true }
    );

    return result;
}


const sessionProductsHandler = async (products, user, response) => {
    if (products && objCheckerTwo(products) > 0) {
        products.forEach(async (product) => {
            const cart = await retrieveCart(user._id);
            await transferSessionProductsToCart(cart._id, product);
        })
        response.session.destroy();
    }
    return;
}


module.exports = { assignCartToUser, addProductToCart, removeProductFromCart, sessionProductsHandler}