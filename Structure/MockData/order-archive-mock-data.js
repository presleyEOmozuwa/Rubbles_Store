const orderOne = {
    _id: '5orf191e810c19729de860e1',
    userId: '5u7f191e810c19729de860e2',
    stripecustomerid: "stripeIdOne",
    orderNumber: "ordernumber001",
    checkoutSessionId: "ordersession001",
    deliveryTrackingId: "delivery tracking id",
    deliveryStatus: "pending",
    deliveryTrackingUrl: "delivery tracking url",
    estimatedDeliveryDate: "estimatedDeliveryDate",
    orderplaced: "date of order",
    cardType: "card type",
    last4: "last 4 digits",
    shipping: 0.00,
    tax: 0.00,
    customerAddress: {
        status: "status",
        city: "city",
        country: "country",
        line1: "line1",
        line2: "line2",
        postalcode: "postalcode",
        state: "state",
        phone: "phone",
        name: "name"

    },
    paymentStatus: "unpaid",
    orderTotal: 10.99,
    cartItems: [productOne, productTwo]
}

const orderTwo = {
    _id: '5orf191e810c19729de860e2',
    userId: '5u7f191e810c19729de860e3',
    stripecustomerid: "stripeIdTwo",
    orderNumber: "ordernumber002",
    checkoutSessionId: "ordersession002",
    deliveryTrackingId: "delivery tracking id",
    deliveryStatus: "pending",
    deliveryTrackingUrl: "delivery tracking url",
    estimatedDeliveryDate: "estimatedDeliveryDate",
    orderplaced: "date of order",
    cardType: "card type",
    last4: "last 4 digits",
    shipping: 0.00,
    tax: 0.00,
    customerAddress: {
        status: "status",
        city: "city",
        country: "country",
        line1: "line1",
        line2: "line2",
        postalcode: "postalcode",
        state: "state",
        phone: "phone",
        name: "name"

    },
    paymentStatus: "unpaid",
    orderTotal: 10.99,
    cartItems: [productTwo]
}


const orderArchivelist = [
    {
        _id: '5orh191e810c19729de860e1',
        userId: '5u7f191e810c19729de860e2',
        orders: [orderOne, orderTwo]
    },
    {
        _id: '5orh191e810c19729de860e2',
        userId: '5u7f191e810c19729de860e3',
        orders: [orderTwo]
    }
]

const orderArchive = {
    _id: '5orh191e810c19729de860e2',
    userId: '5u7f191e810c19729de860e3',
    orders: [orderTwo]
}

module.exports = { orderArchivelist, orderArchive }