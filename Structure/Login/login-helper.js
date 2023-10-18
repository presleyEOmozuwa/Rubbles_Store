const { signAccessToken, signRefreshToken, signRefreshTokenPlus, saveRefreshToken } = require('../Utils/token.utils');
const { sendOTPtoUser } = require('../Utils/email-utils');

const loginChecker = async (user, useToken, rememberMe, location, res, otp) => {
    if(useToken){
        await sendOTPtoUser(user, otp);
        res.send({"status": "otp sent to user"});
    }
    else if(rememberMe && location){
        const renewToken = signRefreshTokenPlus(user)
        await saveRefreshToken(user, renewToken)
        res.send({"acc": signAccessToken(user), "renewtoken": renewToken});
    }
    else if(!rememberMe && location){
        const renewToken = signRefreshToken(user)
        await saveRefreshToken(user, renewToken)
        res.send({"acc": signAccessToken(user), "renewtoken": renewToken});
    }
    else{
        const renewToken = signRefreshToken(user)
        await saveRefreshToken(user, renewToken)
        res.send({"acc": signAccessToken(user), "renewtoken": renewToken});
    }
}


module.exports = { loginChecker }