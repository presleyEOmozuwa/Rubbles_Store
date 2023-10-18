const express = require('express');
const router = express.Router();
const { getProduct } = require('../Product/product-service');

router.post('/api/addtocart/guestUser', async (req, res) => {
    try {
        req.session.guestId = req.session.id;

        // SETTING AN ARRAY IN SESSION TO HOLD GUEST PRODUCTS
        req.session.products ??= [];

        // const { products } = req.session;

        const product = await getProduct(req.body.productId);

        // IF ARRAY IS EMPTY, ADD PRODUCT
        if (!req.session.products) {
            req.session.products.push(product);
            res.send({ "status": "product successfully added to cart" });
        }

        // IF NOT EMPTY, CHECK IF PRODUCT ALREADY EXIST
        const isProductInCart = req.session.products.some((item) => item._id === product._id);

        if (isProductInCart) {
            throw new Error("product already exist on cart")
        }

        req.session.products.push(product);
        res.send({ "status": "product successfully added to cart", "isProductAdded": true })

    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }

})


// REQUEST FROM UNREGISTERED USER TO GET SESSION CART ITEMS 
router.get('/api/shopping-cart/guestUser', (req, res) => {
    try {
        const { products } = req.session;

        if (!products) {
            throw new Error("cart is empty");
        }

        res.send({ "cart": { products: products } })

    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// REQUEST FROM UNREGISTERED USER TO DELETE A PRODUCT FROM SESSION CART
router.post('/api/delete-item/guestUser', (req, res) => {
    try {
        const { products } = req.session;

        const product = products?.find((p) => p._id === req.body.productId);

        if (!product) {
            throw new Error("product not found, nothing to delete");
        }

        let index = products?.indexOf(product);
        products?.splice(index, 1);

        res.send({ "status": "product removed from cart successfully", "deletedItem": product });

    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// REQUEST FROM UNREGISTERED USER TO GET SESSION CART ITEMS 
router.get('/api/shopping-cart/guestUser', (req, res) => {
    try {
        const { items } = req.session;

        if (!items) {
            throw new Error("cart is empty");
        }

        res.send({ "cart": { products: items } })

    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});


module.exports = router;

