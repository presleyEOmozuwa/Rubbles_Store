const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../Utils/token.utils')
const { getAppUser } = require('../AppUser/appuser-service');
const { retrieveOrderArchive } = require('../Order_Archive/order-archive-service');
const shippo = require('shippo')(process.env.SHIPPO_API_TOKEN);
const { addressFromHandler, addressToHandler } = require('./delivery.service');

router.get('/api/carriers', async (req, res) => {
    const carriers = await shippo.carrieraccount.list();
    res.send({"carriers": carriers});
})

router.get('/api/from', async (req, res) => {
    try{
        const addressfrom = await addressFromHandler()
        if(!addressfrom){
            throw new Error("addressfrom failed")
        }
        res.send({"addressfrom": addressfrom});
    }
    catch(err){
        res.status(400).send({ "error": err.message });
    }

})

router.get('/api/to', async (req, res) => {
    try{
        const addressto = await addressToHandler()
        if(!addressto){
            throw new Error("addressto failed")
        }
        res.send({"addressto": addressto});
    }
    catch(err){
        res.status(400).send({ "error": err.message });
    }

})


router.get('/api/delivery/status/:deliveryId/:sessionId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id

        const user = await getAppUser(userId);

        const orderArchive = await retrieveOrderArchive(user._id);

        const order = orderArchive.orders.find((orderItem) => orderItem.checkoutSessionId === req.params.sessionId);

        const client = deliveryStatusHandler();

        const result = await client.getDelivery(req.params.deliveryId);

        if (result.data.tracking_url !== order.deliveryTrackingUrl) {
            throw new Error("delivery url do not match")
        }

        res.send({ "url": result.data.tracking_url })

    }
    catch (err) {
        res.status(401).send({ error: err.message });
    }
});

module.exports = router