const crypto = require('crypto');
const { authenticator } = require('otplib');

const generateAccessTokenKey = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}

const generateRefreshTokenKey = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}

const generatepassWordResetKey = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}

const generateEmailTokenKey = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}
const generateSessionSecret = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}


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

const saveOTPSecret = async (user, otpSecret) => {
    user.set({
        otpsecret: otpSecret
    })
    await user.save();
}

const getOTPSecret  = (user) => {
    const secret = user.otpsecret;
    return secret;
}


module.exports = {generateAccessTokenKey, generateRefreshTokenKey, generateSessionSecret, generatepassWordResetKey, generateEmailTokenKey, generateOTPSecret, generateOTP, saveOTPSecret, getOTPSecret }