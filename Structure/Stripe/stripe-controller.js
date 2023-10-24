const express = require('express');
const router = express.Router();
require('dotenv').config({ path: "../../vars/.env" });
const stripe = require('stripe')(process.env.STRIPE_KEY);
const { verifyAccessToken } = require('../Utils/token.utils');
const { getAppUser } = require('../AppUser/appuser-service');
const { updateOrder, resetOrder } = require('../Order/order-service');
const { updateOrderShippingInfo } = require('../Order/order.helper')
const { addOrderToOrderArchive } = require('../Utils/order-utils');
const { retrieveOrderArchive } = require('../Order_Archive/order-archive-service');
const { addSubToSubArchive } = require('../Utils/subscription-utils');
const { updateSub, resetSub } = require('../Subscription/subscription-service');
const { retrieveSubArchive } = require('../Subscription_Archive/sub-archive-service');
const { addItemNamesToList } = require('../Subscription_Archive/helper')



// CUSTOMER BILLING PORTAL
router.get('/api/stripe/customer/portal', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripecustomerid,
            return_url: "http://localhost:3000/auth/user"
        });

        res.send({ "url": session.url });

    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});


// CHECKOUT SUCCESS, REGULAR ITEMS
router.get('/api/regular/checkout/success/multiple/:sessionId',
    async (req, res) => {
        try {
            const decodedToken = await verifyAccessToken(req.headers["authorization"]);

            const userId = decodedToken.user.id;

            const user = await getAppUser(userId);
            
            // update with stripe customer payment info
            const stripeOrderUpdate = await updateOrder(user, req.params.sessionId);

            // update with shippo shipping details
            const shippingOrderUpdate = await updateOrderShippingInfo(user, stripeOrderUpdate);
            
            // add order to order archive store
            await addOrderToOrderArchive(user, shippingOrderUpdate);
            
            // reset order store
            await resetOrder(user);
            
            // get order from order archive for use on client side
            const orderArchive = await retrieveOrderArchive(user._id);

            const order = orderArchive.orders.find((orderItem) => orderItem.checkoutSessionId === req.params.sessionId);

            if (!order) {
                throw new Error("order not found in archive");
            }

            res.send({ "status": "multiple checkout success order processed", "order": order });

        }
        catch (err) {
            res.status(400).send({ error: err.message });
        }
    });


// CHECKOUT SUCCESS, SUBSCRIPTION ITEMS
router.get('/api/sub/checkout/success/multiple/:sessionId',
    async (req, res) => {
        try {
            const decodedToken = await verifyAccessToken(req.headers["authorization"]);

            const userId = decodedToken.user.id;

            const user = await getAppUser(userId);
            
            // update with stripe customer payment info
            const stripeSubUpdate = await updateSub(user, req.params.sessionId);

            // add the names of subscribed items to list
            await addItemNamesToList(req.params.sessionId);
            
             // add order to subscription archive store
            await addSubToSubArchive(user, stripeSubUpdate);
            
            // reset subscription store
            await resetSub(user);
            
            // get subscription from subscription archive for use on client side
            const subArchive = await retrieveSubArchive(user._id);

            const sub = subArchive.subscriptions.find((subItem) => subItem.checkoutSessionId === req.params.sessionId);

            if (!sub) {
                throw new Error("subscription not found in archive");
            }

            res.send({ "status": "multiple subscription checkout success", "subscription": sub });

        }
        catch (err) {
            res.status(400).send({ error: err.message });
        }
    });


// CHECKOUT FAILURE, MULTIPLE ITEMS
router.get('/api/checkout/failure/multiple/:sessionId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        await resetOrder(user);

        res.send({ "status": "multiple failed order removed" });

    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});


// CHECKOUT FAILURE, SUBSCRIPTION ITEMS
router.get('/api/checkout/failure/single/:sessionId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        await resetOrder(user);

        res.send({ "status": "single failed order removed" });

    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});


module.exports = router;