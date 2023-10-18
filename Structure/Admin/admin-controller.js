const express = require('express');
const router = express.Router();
const { registerAdmin } = require('./admin-register.-service');
const { verifyAccessToken } = require('../Utils/token.utils');
const { getAppUser, deleteUser, upDateUser } = require('../AppUser/appuser-service');
const { saveDeletedUser, blockUserService, unblockUserService, removeFromLocation, clearAllDeletedUsers, clearLocationUsers } = require('../Utils/user-utils');


router.post('/api/register/admin', async (req, res) => {
    try {
        const { adminUser } = await registerAdmin(req.body.payload);

        res.send({ "status": "admin registration successful", "isRegistered": true, "adminUser": adminUser });

    } catch (err) {
        res.status(400).send({ error: err.message });
    }

});


router.get('/api/admin/get-user/:userId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            const user = await getAppUser(req.params.userId);
            res.send({ "user": user });
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }

});

router.put('/api/admin/user-update', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        const { userId, username, email } = req.body.payload;

        if (admin.role === "admin") {
            await upDateUser(userId, { username, email });
            res.send({ "status": "user updated successfully" });
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.get('/api/admin/user-block/:userId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            const { sealedUser } = await blockUserService(req.params.userId);

            sealedUser.set({
                isblocked: true
            })

            await sealedUser.save();

            res.send({ "blocked": "user successfully blocked" });
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.get('/api/admin/user-unblock/:userId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            const { unsealedUser } = await unblockUserService(req.params.userId);

            unsealedUser.set({
                isblocked: false
            })

            await unsealedUser.save();

            res.send({ "unblocked": "user successfully unblocked" });
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.delete('/api/admin/user-delete/:userId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            const { removedUser } = await deleteUser(req.params.userId);

            await saveDeletedUser(removedUser);

            await removeFromLocation(removedUser);
            
            res.send({ "status": "user deleted successfully", "deletedUser": removedUser });
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.delete('/api/admin/clear-deletedusers', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            await clearAllDeletedUsers();
            res.send({ "status": "deleted users successfully removed" });
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.delete('/api/admin/clear-locationusers', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            await clearLocationUsers();
            res.send({ "status": "users location successfully removed" });
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});

module.exports = router;