const { shippmentHandler } = require('../Shipping/shipment-service');
const { transactionHandler } = require('../Shipping/transaction-service');
const { estimatedDateHandler } = require('../Utils/date-utils');
const { resetOrder } = require('./order-service');

const updateOrderShippingInfo = async (user, order) => {
    const shipment = await shippmentHandler();
    const trans = await transactionHandler();

    order.set({
        deliveryTrackingId: trans.tracking_number,
        deliveryTrackingUrl: trans.tracking_url_provider,
        estimatedDeliveryDate: estimatedDateHandler(shipment.rates[0].estimated_days),
        deliveryStatus: trans.tracking_status,
    })

    const updatedOrder = await order.save();

    if(!updatedOrder){
        resetOrder(user);
        throw new Error("shipping order update failed")
    }

    return updatedOrder

}

module.exports = { updateOrderShippingInfo }