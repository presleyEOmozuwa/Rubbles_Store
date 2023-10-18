const express = require('express');
const router = express.Router()
const { forgotPasswordService, verifyPasswordResetTokens, verifyEmailTokens } = require('./account-setting-service');

// EMAIL CONFIRMATION REQUEST
router.post('/api/email-confirmation', async (req, res) => {
    try {
        await verifyEmailTokens(req.body.token);
        res.send({ "isEmailConfirmed": true });

    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// FORGOT PASSWORD REQUEST
router.post('/api/forgot-password/payload', async (req, res) => {
    try {
        await forgotPasswordService(req.body.email);
        res.send({ "status": "reset password link sent to inbox" });
    }
    catch (err) {
        res.status(401).send({ error: err.message });
    }
});

// RESET PASSWORD REQUEST
router.post('/api/reset-password/payload', async (req, res) => {
    try {
        const { token, password } = req.body.payload;

        await verifyPasswordResetTokens(token, password);

        res.send({ "status": "password reset successful" });

    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
});

module.exports = router;