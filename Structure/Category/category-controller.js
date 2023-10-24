const express = require('express');
const router = express.Router();
const { getCategoryList, getCategory, createCategory, deleteCategory } = require('./category-service');
const { getAppUser } = require('../AppUser/appuser-service');
const { verifyAccessToken } = require('../Utils/token.utils')


router.get('/api/category-list', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if(admin.role === "admin"){
            const categories = await getCategoryList()

            return res.send({ "categoryList": categories });
        }

    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})

router.get('/api/category/:categoryId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            const category = await getCategory(req.params.categoryId);
            res.send({ "category": category });
        }

    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})

router.post('/api/create/category', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            await createCategory(req.body.payload)
            res.send({ "status": "category created successfully" });
        }

    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})


router.delete('/api/delete/category/:categoryId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            const { deletedCategory } = await deleteCategory(req.params.categoryId);

            res.send({ "status": "category deleted successfully", "deletedCategory": deletedCategory });
        }

    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})


module.exports = router