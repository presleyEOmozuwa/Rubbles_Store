const userlist = [
    {
        stripecustomerid: "stripeOne",
        username: "ProfBookie",
        email: "presleyomozuwa@gmail.com",
        password: "hash#presley001",
        role: "admin",
        confirmemail: false,
        terms: true,
        isblocked: false,
        otpSecret: 'presley001'
    },
    {
        stripecustomerid: "stripeTwo",
        username: "WesleyPongo",
        email: "wesleyomozuwa@gmail.com",
        password: "hash#wesley002",
        role: "client",
        confirmemail: true,
        terms: true,
        isblocked: false,
        otpSecret: 'wesley002'
    },
    {
        stripecustomerid: "stripeThree",
        username: "Lexy82",
        email: "alexisomozuwa@gmail.com",
        password: "hash#alexis003",
        role: "client",
        confirmemail: true,
        terms: true,
        isblocked: false,
        otpSecret: 'alexis003'
    },
    {
        stripecustomerid: "stripeFour",
        username: "Taylor87",
        email: "taylorswift@gmail.com",
        password: "hash#taylor004",
        role: "client",
        confirmemail: true,
        terms: true,
        isblocked: false,
        otpSecret: 'taylor004'
    }
]

const createdUserlist = [
    {
        _id: '5u7f191e810c19729de860e5',
        stripecustomerid: "stripeFive",
        username: "Hensley85",
        email: "hensleyomozuwa@gmail.com",
        password: "hash#hensley005",
        role: "client",
        confirmemail: true,
        terms: true,
        isblocked: false,
        otpSecret: 'hensley005'
    },
    {
        _id: '5u7f191e810c19729de860e6',
        stripecustomerid: "stripeSix",
        username: "Smith85",
        email: "smithblake@gmail.com",
        password: "hash#smith006",
        role: "client",
        confirmemail: true,
        terms: true,
        isblocked: false,
        otpSecret: 'smith006'
    }
]

const userOne = {
    _id: '5u7f191e810c19729de860e2',
    stripecustomerid: "stripeTwo",
    username: "WesleyPongo",
    email: "wesleyomozuwa@gmail.com",
    password: "hash#wesley002",
    role: "client",
    confirmemail: true,
    terms: true,
    isblocked: false,
    otpSecret: 'wesley002'
}

const userTwo = {
    _id: '5u7f191e810c19729de860e3',
    stripecustomerid: "stripeThree",
    username: "Lexy82",
    email: "alexisomozuwa@gmail.com",
    password: "hash#alexis003",
    role: "client",
    confirmemail: true,
    terms: true,
    isblocked: false,
    otpSecret: 'alexis003'
}


module.exports = { userlist, createdUserlist, userOne, userTwo }