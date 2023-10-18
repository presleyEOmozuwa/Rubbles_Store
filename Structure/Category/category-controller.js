const express = require('express');
const router = express.Router();
const { getCategoryList, getCategory, createCategory } = require('./category-service');
const { getAppUser } = require('../AppUser/appuser-service');


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

router.post('/api/create/category', async (req, res) => {
    try {
        await createCategory(req.body)
        res.send({ "status": "category created successfully" });
    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})

router.get('/api/category/:categoryId', async (req, res) => {
    try {
        const category = await getCategory(req.params.categoryId);

        res.send({ "category": category });
    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})


module.exports = router