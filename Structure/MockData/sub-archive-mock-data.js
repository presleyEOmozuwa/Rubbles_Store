const subOne = {
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
}

const subTwo = {
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

const subArchivelist = [
    {
        _id: '5suh191e810c19729de860e1',
        userId: '5u7f191e810c19729de860e2',
        subNames: ["Learn React", "Learn Asp.NetCore"],
        subscriptions: [subOne, subTwo]
    },
    {
        _id: '5suh191e810c19729de860e2',
        userId: '5u7f191e810c19729de860e3',
        subNames: ["Learn Asp.NetCore"],
        subscriptions: [subTwo]
    }
]


module.exports = { subArchivelist }