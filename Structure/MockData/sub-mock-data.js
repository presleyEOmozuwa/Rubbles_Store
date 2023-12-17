const subProductOne = {
    _id: '5p7f191e810c19729de860e3',
    prodName: "Learn React",
    price: 15,
    coupon: 0,
    newPrice: 15,
    priceId: "learnReactId",
    quantity: 1,
    stockQty: 0,
    typeOfItem: "subscription",
    categories: ['5c7f191e810c19729de860e3']
}

const subProductTwo = {
    _id: '5p7f191e810c19729de860e4',
    prodName: "Learn Asp.NetCore",
    price: 25,
    coupon: 0,
    newPrice: 25,
    priceId: "learnAspnetCoreId",
    quantity: 1,
    stockQty: 0,
    typeOfItem: "subscription",
    categories: ['5c7f191e810c19729de860e3']
}


const subscriptionlist = [
    {
        _id: '5ors191e810c19729de860e1',
        userId: '5u7f191e810c19729de860e2',
        stripecustomerid: "stripeIdOne",
        subNumber: "subnumber001",
        checkoutSessionId: "ordersession001",
        currentPeriodStarts: "current period starts",
        cardType: "card type",
        last4: "last 4 digits",
        tax: 0.00,
        paymentStatus: "unpaid",
        orderTotal: 10.99,
        subItems: [subProductOne, subProductTwo]
    },
    {
        _id: '5ors191e810c19729de860e2',
        userId: '5u7f191e810c19729de860e3',
        stripecustomerid: "stripeIdTwo",
        subNumber: "subnumber002",
        checkoutSessionId: "ordersession002",
        currentPeriodStarts: "current period starts",
        cardType: "card type",
        last4: "last 4 digits",
        tax: 0.00,
        paymentStatus: "unpaid",
        orderTotal: 10.99,
        subItems: [subProductOne]
    }
]

const subscription = {
    _id: '5ors191e810c19729de860e2',
    userId: '5u7f191e810c19729de860e3',
    stripecustomerid: "stripeIdTwo",
    orderNumber: "ordernumber002",
    checkoutSessionId: "ordersession002",
    cardType: "card type",
    last4: "last 4 digits",
    tax: 0.00,
    paymentStatus: "unpaid",
    orderTotal: 10.99,
    subItems: [subProductOne]
}

module.exports = { subscriptionlist, subscription }