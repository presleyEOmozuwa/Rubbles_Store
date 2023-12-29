const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: "./vars/.env" });
const express = require('express');
const session = require('express-session');


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


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Configure session middleware
const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;
app.use(
    session({
        secret: SESSION_SECRET_KEY,
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


module.exports = app