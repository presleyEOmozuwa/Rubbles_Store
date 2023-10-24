const express = require('express');
const router = express.Router();
const { register } = require('./register-service');
const { retrieveCart } = require('../Cart_AuthUser/cart-service');
const { assignCartToUser, transferSessionProductsToCart } = require('../Utils/cart-util');
const { assignSubCartToUser } = require('../Utils/cart-subitems-utils');
const { assignOrderArchiveToUser, assignOrderStoreToUser } = require('../Utils/order-utils');
const { refreshTokenStore } = require('../Utils/token.utils');
const { sendEmailToUser } = require('../Utils/email-utils');
const { locationTracker } = require('../Utils/user-utils');
const {  assignSubscriptionToUser, assignSubArchiveToUser } = require('../Utils/subscription-utils');


router.post('/api/register', async (req, res) => {
    try {
        // REGISTERED USER RETURNED
        const { normalUser } = await register(req.body.payload);

        await locationTracker(normalUser, req.session.id);
        
        await assignCartToUser(normalUser);

        await assignSubCartToUser(normalUser);

        const { products } = req.session;

        if(products){
            products.forEach(async (product) => {
                const cart = await retrieveCart(normalUser._id);
                await transferSessionProductsToCart(cart._id, product);
            })
        }

        req.session.destroy();
        
        await refreshTokenStore(normalUser);

        await assignOrderStoreToUser(normalUser);
        
        await assignOrderArchiveToUser(normalUser);

        await assignSubscriptionToUser(normalUser);

        await assignSubArchiveToUser(normalUser);
        
        await sendEmailToUser(normalUser);

        res.send({ "status": "client registration successful", "isRegistered": true });
    
    } 
    catch (err) {
        res.status(400).send({ error: err.message });
    }

});

module.exports = router;