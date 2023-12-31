const productlist = [
    {
        _id: '5p7f191e810c19729de860e1',
        prodName: "Sofa",
        price: 1250,
        coupon: 50,
        newPrice: 1200,
        priceId: "not applicable",
        quantity: 1,
        stockQty: 10,
        typeOfItem: "regular",
        categories: ['5c7f191e810c19729de860e1']
    },
    {
        _id: '5p7f191e810c19729de860e2',
        prodName: "Sneakers",
        price: 1150,
        coupon: 20,
        newPrice: 1130,
        priceId: "not applicable",
        quantity: 1,
        stockQty: 10,
        typeOfItem: "regular",
        categories: ['5c7f191e810c19729de860e2']
    },
    {
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
    },
    {
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
]

const productOne = {
    _id: '5p7f191e810c19729de860e1',
    prodName: "Sofa",
    price: 1250,
    coupon: 50,
    newPrice: 1200,
    priceId: "stripepriceId",
    quantity: 1,
    stockQty: 10,
    categories: ['5c7f191e810c19729de860e1']
}

const productTwo = {
    _id: '5p7f191e810c19729de860e2',
    prodName: "Sneakers",
    price: 1150,
    coupon: 20,
    newPrice: 1130,
    priceId: "not applicable",
    quantity: 1,
    stockQty: 10,
    typeOfItem: "regular",
    categories: ['5c7f191e810c19729de860e2']
}


module.exports = { productlist, productOne, productTwo }
