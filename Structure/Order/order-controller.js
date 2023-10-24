const express = require('express');
const router = express.Router();
require('dotenv').config({ path: "./vars/.env" });
const { verifyAccessToken } = require('../Utils/token.utils');
const { createOrder } = require('./order-service');
const { getAppUser } = require('../AppUser/appuser-service')
const { multipleRegularItemsHandler } = require('../Utils/multiple-regular-item-utils');
const { singleRegularItemHandler } = require('../Utils/single-regular-items-utils');
const { addCartItemToOrder } = require('../Utils/order-utils');

router.post('/api/regular/multiple/create-checkout-session', async (req, res) => {
    const decodedToken = await verifyAccessToken(req.headers["authorization"]);

    const userId = decodedToken.user.id;

    const user = await getAppUser(userId);

    const session = await multipleRegularItemsHandler(user, req.body.cartItems);

    const order = await createOrder(user, session);

    req.body.cartItems.forEach(async (item) => {
        await addCartItemToOrder(order._id, item);
    })

    res.send({ "url": session.url });

})

router.post('/api/single/regular/create-checkout-session', async (req, res) => {
    const decodedToken = await verifyAccessToken(req.headers["authorization"]);

    const userId = decodedToken.user.id;

    const user = await getAppUser(userId);

    const session = await singleRegularItemHandler(user, req.body.cartItems);

    const order = await createOrder(user, session);

    req.body.cartItems.forEach(async (item) => {
        await addCartItemToOrder(order._id, item);
    })

    res.send({ "url": session.url });

})

module.exports = router;