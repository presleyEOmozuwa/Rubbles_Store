const { Order } = require('../Models/common-model');
const { getOrder } = require('../Order/order-service');
const { OrderArchive } = require('../Models/common-model');
const { getOrderArchive, retrieveOrderArchive } = require('../Order_Archive/order-archive-service');

const assignOrderStoreToUser = async (user) => {
    const order = await getOrder(user._id);
    if (!order) {
        const result = await Order.create({
            userId: user._id,
            email: user.email
        })
        return result;
    }
    return;
}


const assignOrderArchiveToUser = async (user) => {
    const orderArchive = await getOrderArchive(user._id);

    if (!orderArchive) {
        const result = await OrderArchive.create({
            userId: user._id,
            email: user.email
        })
        return result;
    }
    return;
}

const addOrderToOrderArchive = async (user, updatedOrder) => {
    const orderArchive  = await retrieveOrderArchive(user._id);
    
    await OrderArchive.findByIdAndUpdate(
        orderArchive._id,
        { $addToSet: { orders: [updatedOrder] } },
        { new: true }
    );
}


const addCartItemToOrder = async (orderId, item) => {
    await Order.findByIdAndUpdate(
        orderId,
        { $addToSet: { cartItems: [item] } },
        { new: true }
    );
}


module.exports = { assignOrderArchiveToUser, assignOrderStoreToUser, addOrderToOrderArchive, addCartItemToOrder }