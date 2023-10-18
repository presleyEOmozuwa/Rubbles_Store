const { getSubCart } = require('../Cart_Subscription_Items/subcart-service');
const { SubCart } = require('../Models/common-model');


const assignSubCartToUser = async (user) => {
    const subcart = await getSubCart(user._id);
    if (!subcart) {
        await SubCart.create({
            userId: user._id
        })
    }
    else {
        throw new Error("user's subcart already exist")
    }

}

const addProductToSubCart = async (subcartId, product) => {
    await SubCart.findByIdAndUpdate(
        subcartId,
        { $addToSet: { subitems: [product._id] } },
        { new: true }
    );
}

const removeProductFromSubCart = async (subcartId, product) => {
    await SubCart.findByIdAndUpdate(
        subcartId,
        { $pullAll: { subitems: [product._id] } },
        { new: true }
    );
}

module.exports = { assignSubCartToUser, addProductToSubCart, removeProductFromSubCart }