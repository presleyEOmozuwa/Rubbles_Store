const express = require('express');
const router = express.Router();
const { getAppUser } = require('../AppUser/appuser-service')
const { retrieveOrderArchive } = require('./order-archive-service');
const { verifyAccessToken } = require('../Utils/token.utils');

router.get('/api/order/history', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        const orderArchive = await retrieveOrderArchive(user._id);

        res.send({ "orderArchive": orderArchive });
    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})

module.exports = router;