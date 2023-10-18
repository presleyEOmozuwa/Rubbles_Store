const RefreshToken = require('../Models/refreshToken-model');

const getRefreshToken = async (userId) => {
    const token = await RefreshToken.findOne({userId: userId});
    return token;
}

const retrieveRefreshToken = async (userId) => {
    const token = await RefreshToken.findOne({userId: userId});
    
    if(!token){
        throw new Error("refresh token document not found")
    }
    
    return token;
}


module.exports = { getRefreshToken, retrieveRefreshToken }