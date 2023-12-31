const { signAccessToken, signRefreshToken, signRefreshTokenPlus, saveRefreshToken } = require('../Utils/token.utils');
const { sendOTPtoUser } = require('../Utils/email-utils');
const LocationTracker = require('../Models/location-tracker-model');

const sessionIdMatch = async (user, sessionId) => {
    const loc = await LocationTracker.findOne({
        email: user.email,
        locationId: sessionId
    })
    return loc;
}

const loginChecker = async (user, useToken, rememberMe, sessionId, res, otp) => {
    const loc = await sessionIdMatch(user, sessionId);
    
    if(useToken){
        await sendOTPtoUser(user, otp);
        res.send({"status": "otp sent to user", "userId": user._id});
    }
    else if(rememberMe && loc){
        const renewToken = signRefreshTokenPlus(user)
        await saveRefreshToken(user, renewToken)
        res.send({"accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful", rem: "true", loc: "true"});
    }
    else if(!rememberMe && loc){
        const renewToken = signRefreshToken(user)
        await saveRefreshToken(user, renewToken)
        res.send({"accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful", rem: "false", loc: "true"});
    }
    else if(!rememberMe && !loc){
        await sendOTPtoUser(user, otp);
        res.send({"status": "otp sent to user", "userId": user._id, rem: "false", loc: "false"});
    }
    else{
        const renewToken = signRefreshToken(user)
        await saveRefreshToken(user, renewToken)
        res.send({"accToken": signAccessToken(user), "renewToken": renewToken, "status": "login successful", common: "all"});
    }
}


module.exports = { loginChecker }