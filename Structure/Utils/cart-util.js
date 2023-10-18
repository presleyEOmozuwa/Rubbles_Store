const { getCart } = require('../Cart_AuthUser/cart-service');
const { Cart } = require('../Models/common-model');


const assignCartToUser = async (user) => {
    const cart = await getCart(user._id);
    if (!cart) {
        await Cart.create({
            userId: user._id
        })
    }
    else {
        throw new Error("user's cart already exist")
    }

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


module.exports = { assignCartToUser, addProductToCart, transferSessionProductsToCart, removeProductFromCart }