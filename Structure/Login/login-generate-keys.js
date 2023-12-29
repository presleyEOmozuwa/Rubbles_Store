
const { authenticator } = require('otplib');

const generateOTPSecret = () => {
    const secret = authenticator.generateSecret(64);
    if(!secret){
        throw new Error("otp secret key generation failed");
    }
    return secret;
}

const generateOTP = async (otpSecret) => {
    const otp = authenticator.generate(otpSecret)
    if(!otp){
        throw new Error("otp generation failed")
    }
    return otp;
}

module.exports = { generateOTPSecret, generateOTP }