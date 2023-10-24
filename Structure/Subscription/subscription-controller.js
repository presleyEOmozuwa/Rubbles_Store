const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../Utils/token.utils');
const { getAppUser } = require('../AppUser/appuser-service')
const { createSub } = require('./subscription-service');
const { addSubToOrder } = require('../Utils/subscription-utils');
const { itemNameChecker } = require('./helper')
const { multipleSubscriptionItemsHandler } = require('../Utils/multiple-subscription-items-utils');
const { singleSubscriptionItemHandler } = require('../Utils/single-subscription-item-utils');

router.post('/api/sub/multiple/create-checkout-session', async (req, res) => {
    const decodedToken = await verifyAccessToken(req.headers["authorization"]);

    const userId = decodedToken.user.id;

    const user = await getAppUser(userId);

    const items = await itemNameChecker(user, req.body.products)

    const session = await multipleSubscriptionItemsHandler(user, items);

    const sub = await createSub(user, session);

    items.forEach(async (item) => {
        await addSubToOrder(sub._id, item);
    })

    res.send({ "url": session.url });

})

router.post('/api/sub/single/create-checkout-session', async (req, res) => {
    const decodedToken = await verifyAccessToken(req.headers["authorization"]);

    const userId = decodedToken.user.id;

    const user = await getAppUser(userId);

    const items = await itemNameChecker(user, req.body.products)

    const session = await singleSubscriptionItemHandler(user, items);

    const sub = await createSub(user, session);

    items.forEach(async (item) => {
        await addSubToOrder(sub._id, item);
    })

    res.send({ "url": session.url });

})

module.exports = router;