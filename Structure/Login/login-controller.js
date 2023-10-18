const express = require('express');
const router = express.Router();
require('dotenv').config({ path: "../../vars/.env" });
const stripe = require('stripe')(process.env.STRIPE_KEY);
const { getAppUser } = require('../AppUser/appuser-service');
const { signAccessToken, signRefreshToken, signRefreshTokenPlus, verifyRefreshToken, resetRefreshToken, verifyGoogleToken, saveRefreshToken } = require('../Utils/token.utils');
const { loginUser } = require('./login-service');
const { generateOTPSecret, generateOTP, saveOTPSecret, getOTPSecret } = require('../Utils/secret-keys-utils');
const User = require('../Models/user-model');
const LocationTracker = require('../Models/location-tracker-model');
const { assignCartToUser } = require('../Utils/cart-util');
const { authenticator } = require('otplib');
const { loginChecker } = require('./login-helper');

// REQUEST TO LOGIN
router.post("/api/login/payload", async (req, res) => {
    try {
        const { email, password } = req.body

        const rememberMe = req.body.rememberMe.ischecked;

        const useToken = req.body.useToken.ischecked;

        const { authUser } = await loginUser(email, password);

        const secretKey = generateOTPSecret();

        await saveOTPSecret(authUser, secretKey);

        const otpSecretKey = await getOTPSecret(authUser);

        const otp = await generateOTP(otpSecretKey);

        const location = await LocationTracker.findOne({
            userId: authUser._id,
            locationId: req.session.id,
            email: authUser.email
        });

        await loginChecker(authUser, useToken, location, rememberMe, res, otp);

    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.post("/api/otp-code/payload", async (req, res) => {
    try {
        const { code, userId } = req.body;

        const user = await getAppUser(userId);
        let otpsecret = user.otpsecret;

        const isValid = authenticator.check(String(code), String(otpsecret));

        if(!isValid){
            throw new Error("invalid otp creds")
        }

        const renewToken = signRefreshTokenPlus(user)
        
        await saveRefreshToken(user, renewToken)
        
        res.send({ "accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful" });

    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }

});


router.post("/api/google-signin", async (req, res) => {
    try {
        // VERIFY GOOGLE CREDENTIALS
        const { clientId, token } = req.body

        const payload = await verifyGoogleToken(clientId, token);

        if (!payload) {
            throw new Error("identity user not found")
        }

        const user = await User.findOne({ email: payload.email });

        if (user) {
            const renewToken = signRefreshTokenPlus(user)
            
            await saveRefreshToken(user, signRefreshTokenPlus(user));
            
            res.send({ "accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful", "isloggedIn": true });
        }
        else {
            const customer = await stripe.customers.create({
                email: payload.email
            });

            const logger = await User.create({
                username: google,
                email: payload.email,
                password: identity,
                role: "client",
                stripecustomerid: customer.id,
                terms: true
            });

            if (!logger) {
                throw new Error("google logger registration failed");
            }

            await assignCartToUser(logger);

            const renewToken = signRefreshToken(logger)
            
            await saveRefreshToken(logger, renewToken);
            
            res.send({ "accToken": signAccessToken(logger), "renewToken": renewToken, "status": "login successful", "isloggedIn": true });
        }

    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// REQUEST TO LOGOUT
router.delete("/api/logout/payload", async (req, res) => {
    try {
        const decodedToken = await verifyRefreshToken(req.body.renewtoken)

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);
        
        await resetRefreshToken(user, req.body.renewtoken);
        
        res.send({ "status": "logout was successful and Token Store resets" });

    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
});


// REQUEST TO RENEW ACCESS TOKEN
router.post("/api/refresh-token/payload", async (req, res) => {
    try {
        const decodedToken = await verifyRefreshToken(req.body.backupToken);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        await resetRefreshToken(user, req.body.backupToken);
        
        const accToken = signAccessToken(user);
        const renewToken = signRefreshToken(user);

        await saveRefreshToken(user, renewToken);

        res.send({ "entryToken": accToken, "renewToken": renewToken });

    } catch (err) {
        res.status(401).send({ error: err.message });
    }

});

module.exports = router;