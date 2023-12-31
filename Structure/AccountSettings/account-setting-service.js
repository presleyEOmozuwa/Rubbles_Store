require('dotenv').config({ path: "../../vars/.env" });
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getAppUser, getUserByEmail } = require('../AppUser/appuser-service');
const { passwordResetToken } = require('../Utils/token.utils');
const { emailSender } = require('../Utils/email-utils');


const verifyEmailTokens = async (token) => {
    const emailTokenKey = process.env.EMAIL_TOKEN_KEY
    jwt.verify(token, emailTokenKey, async (err, decodedToken) => {
        if (err && err.message === "jwt_expired") {
            throw new Error("email token expired");
        }
        else{
            const userId = decodedToken.userId;
            const user  = await getAppUser(userId);
            
            if(!user){
                throw new Error("user not found, and email confirmation failed");
            }

            if(user && user.confirmemail === "true"){
                throw new Error("user email already confirmed");
            }
            
            if(user && user.confirmemail === "false"){
                user.set({
                    confirmemail: "true"
                });

                await user.save();
                return;
            }
        }

    })
}

const verifyPasswordResetTokens = async (token, password) => {
    const passwordResetKey = process.env.PASSWORD_RESET_TOKEN_KEY;
    
    jwt.verify(token, passwordResetKey, async (err, decodedToken) => {
        if (err && err.message === "jwt_expired") {
            throw new Error("password reset token expired");
        }

        if (decodedToken) {
            const userId = decodedToken.userId;
            
            const user  = await getAppUser(userId);

            let hashedPassword = await bcrypt.hash(password, 10);

            if(!hashedPassword){
                throw new Error("password hashing failed");
            }

            user.set({
                password: hashedPassword
            });

            await user.save();
        }
    })
}

const forgotPasswordService = async (email) => {
    let result;
    if (!email) {
        throw new Error("email address not found on request");
    }

    const user = await getUserByEmail(email);

    const token = passwordResetToken(user);

    const clientUrl = `${process.env.CLIENT_BASE_URL}/password/reset/${token}`;

    const content = fs.readFileSync(path.join(__dirname, '../EmailTemplates/password-reset.html')).toString();
    
    const htmlContent = content.replace("[callBackUrl]", clientUrl);

    const emailRequest = {
        from: process.env.ADMIN_EMAIL,
        to: user.email,
        subject: "Password Reset Request",
        html: htmlContent
    }

    result = await emailSender(emailRequest);

    if (result) {
        throw new Error("Email sending failed");
    }
    
    return result;

}

module.exports = { forgotPasswordService, verifyEmailTokens, verifyPasswordResetTokens }