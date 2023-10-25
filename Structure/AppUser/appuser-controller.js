const express = require('express');
const router = express.Router();
const { getAllUsers, getAppUser, upDateUser, deleteUser } = require('./appuser-service');
const { verifyAccessToken } = require('../Utils/token.utils');
const {  saveDeletedUser } = require('../Utils/user-utils');

router.get('/api/users', async (req, res) => {
    try {
        const users = await getAllUsers();

        res.send({ "users": users });
    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})


router.get('/api/user', async (req, res) => {
    try {
        const decodedToken  = await verifyAccessToken(req.headers["authorization"]);
        
        const userId = decodedToken.user.id
        
        const user = await getAppUser(userId)

        res.send({ "user": user });
    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})

router.put('/api/update/user', async (req, res) => {
    try {
        const decodedToken  = await verifyAccessToken(req.headers["authorization"]);
        
        const userId = decodedToken.user.id
        
        const user = await getAppUser(userId)

        await upDateUser(user, req.body.payload);

        res.send({"status": "user updated successfully"});
    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})

router.delete('/api/delete/user/:userId', async (req, res) => {
    try {
        const user = await getAppUser(req.params.userId);
        
        const removedUser = await deleteUser(user._id);

        await saveDeletedUser(removedUser);
        
        res.send({ "Status": "user deleted successfully" });
    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})


module.exports = router