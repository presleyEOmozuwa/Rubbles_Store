const { signAccessToken, signRefreshToken, signRefreshTokenPlus, saveRefreshToken } = require('../Utils/token.utils');
const { sendOTPtoUser } = require('../Utils/email-utils');

const loginChecker = async (user, useToken, rememberMe, location, res, otp) => {
    if(useToken){
        await sendOTPtoUser(user, otp);
        res.send({"status": "otp sent to user", "userId": user._id});
    }
    else if(rememberMe && location){
        const renewToken = signRefreshTokenPlus(user)
        await saveRefreshToken(user, renewToken)
        res.send({"accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful"});
    }
    else if(!rememberMe && location){
        const renewToken = signRefreshToken(user)
        await saveRefreshToken(user, renewToken)
        res.send({"accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful"});
    }
    else if(!rememberMe && !location){
        await sendOTPtoUser(user, otp);
        res.send({"status": "otp sent to user", "userId": user._id});
    }
    else{
        const renewToken = signRefreshToken(user)
        await saveRefreshToken(user, renewToken)
        res.send({"accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful"});
    }
}


module.exports = { loginChecker }