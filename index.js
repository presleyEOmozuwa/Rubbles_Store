
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: "./vars/.env" });
const express = require('express');
const dbconnect = require('./config/dbconnection');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const adminRouter = require('./Structure/Admin/admin-controller');
const accountSettingRouter = require('./Structure/AccountSettings/account-setting-controller');
const accountUpdateRouter = require('./Structure/AccountUpdate/account-update-controller');
const userRouter = require('./Structure/AppUser/appuser-controller');
const registerRouter = require('./Structure/Register/register-controller');
const loginRouter = require('./Structure/Login/login-controller');
const cartRouter = require('./Structure/Cart_AuthUser/cart-controller');
const unregisteredUserCartRouter = require('./Structure/Cart_UnregisteredUser/unregistered-user-cart-controller');
const orderRouter = require('./Structure/Order/order-controller');
const orderArchiveRouter = require('./Structure/Order_Archive/order-archive-controller');
const productRouter = require('./Structure/Product/product-controller');
const categoryRouter = require('./Structure/Category/category-controller');
const subCartRouter = require('./Structure/Cart_Subscription_Items/subcart-controller');
const stripeRouter = require('./Structure/Stripe/stripe-controller');
const subscriptionRouter = require('./Structure/Subscription/subscription-controller');
const subArchiveRouter = require('./Structure/Subscription_Archive/sub-archive-controller');


const { generatePasswordHashKey } = require('./Structure/Utils/secret-keys-utils');


const app = express();

// GLOBAL ROUTES AND MIDDLEWARE
app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    credentials: true
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DATABASE CONNECTION
dbconnect();

app.post('/api/socket', (req, res) => {
    res.send(req.body);
})

//Configure session middleware
const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;
const mongoUrl = process.env.MONGO_URL;
app.use(
    session({
        secret: SESSION_SECRET_KEY,
        store: new MongoStore({ client: mongoose.connection.getClient(), mongoUrl: mongoUrl, ttl: 30 * 24 * 60 * 60, autoRemove: 'native'}),
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,  // if true only transmit cookie over https
            sameSite: "lax",
            httpOnly: false, // if true prevent client side JS from reading the cookie
            // maxAge: 1000 * 60 * 10, // session max age in milliseconds
            maxAge: 30 * 24 * 60 * 60 * 1000
        }
    })
);


app.use(userRouter);
app.use(registerRouter);
app.use(loginRouter);
app.use(adminRouter);
app.use(accountSettingRouter);
app.use(accountUpdateRouter);
app.use(cartRouter);
app.use(unregisteredUserCartRouter);
app.use(productRouter);
app.use(categoryRouter);
app.use(orderRouter);
app.use(orderArchiveRouter);
app.use(stripeRouter);
app.use(subCartRouter);
app.use(subscriptionRouter);
app.use(subArchiveRouter);

// PORT 
const PORT = process.env.PORT || 5000

// Starting the Server
app.listen(PORT, () => {
    console.log(`Dev Server is listening on port ${PORT}`);
})

