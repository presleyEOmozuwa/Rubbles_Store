const express = require('express');
const router = express.Router();
const { register } = require('./register-service');
const { assignCartToUser, sessionProductsHandler } = require('../Utils/cart-util');
const { assignSubCartToUser } = require('../Utils/cart-subitems-utils');
const { assignOrderArchiveToUser, assignOrderStoreToUser } = require('../Utils/order-utils');
const { refreshTokenStore } = require('../Utils/token.utils');
const { sendEmailToUser } = require('../Utils/email-utils');
const { locationTracker } = require('../Utils/user-utils');
const {  assignSubscriptionToUser, assignSubArchiveToUser } = require('../Utils/subscription-utils');


router.post('/api/register', async (req, res) => {
    try {
        // REGISTERED USER RETURNED
        const createdUser = await register(req.body.payload);

        await locationTracker(createdUser, req.sessionID);
        
        await assignCartToUser(createdUser);

        await assignSubCartToUser(createdUser);

        await sessionProductsHandler(req.session.products, createdUser, req)
    
        await refreshTokenStore(createdUser);

        await assignOrderStoreToUser(createdUser);
        
        await assignOrderArchiveToUser(createdUser);

        await assignSubscriptionToUser(createdUser);

        await assignSubArchiveToUser(createdUser);

        const result = await sendEmailToUser(createdUser);

        res.send({ "status": "client registration successful", "isRegistered": true, "sessionId": req.sessionID, "emailServer": result});
    
    } 
    catch (err) {
        res.status(400).send({ error: err.message });
    }

});

module.exports = router;