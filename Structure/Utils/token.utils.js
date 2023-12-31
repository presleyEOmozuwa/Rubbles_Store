const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../Models/refreshToken-model');
const { getRefreshToken, retrieveRefreshToken } = require('../Token/refreshToken-service');
const { OAuth2Client } = require('google-auth-library');


const signAccessToken = (user) => {
    const key = process.env.ACCESS_TOKEN_KEY;
    const payload = {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    }
    const options = {
        issuer: "Rubbles Tech",
        expiresIn: '5h'
    }

    return jwt.sign(payload, key, options);
}

const signRefreshToken = (user) => {
    const key = process.env.REFRESH_TOKEN_KEY;;
    const payload = {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    }
    const options = {
        issuer: "Rubbles Tech",
        expiresIn: '1d'
    }

    return jwt.sign(payload, key, options);
}

const signRefreshTokenPlus = (user) => {
    const key = process.env.REFRESH_TOKEN_KEYPLUS;
    const payload = {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    }
    const options = {
        issuer: "Rubbles Tech",
        expiresIn: '3d'
    }

    return jwt.sign(payload, key, options);
}

const verifyAccessToken = async (strToken) => {
    return new Promise((resolve, reject) => {
        if (!strToken) {
            throw new Error("token not found on request");
        }

        const authToken = strToken.split(" ");
        const accessToken = authToken[1];
        const key = process.env.ACCESS_TOKEN_KEY;
        jwt.verify(accessToken, key, (err, decodedToken) => {
            if (err && err.message === "jwt expired") {
                throw new Error("access token expired")
            }
            else {
                resolve(decodedToken);
            }
        })
    })
}

const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        if (!refreshToken) {
            throw new Error("refresh token not found on request");
        }
        const key = process.env.REFRESH_TOKEN_KEY;
        jwt.verify(refreshToken, key, (err, decodedToken) => {
            if (err && err.message === "jwt expired") {
                throw new Error("refresh token token expired")
            }
            else {
                resolve(decodedToken);
            }
        })
    })
}

const passwordResetToken = () => {
    crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}

const saveRefreshToken = async (user, token) => {
    const doc = await getRefreshToken(user._id);

    if (doc){
        throw new Error("refresh token already exist")
    }
    else{
        await RefreshToken.create({
            refreshtoken: token
        });
    }
}

const verifyGoogleToken = async (clientId, jwtToken) => {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
        idToken: jwtToken,
        audience: clientId,
    });
    
    const payload = ticket.getPayload();

    return payload;
}

const resetRefreshToken = async (user, requestToken) => {
    const doc = await retrieveRefreshToken(user._id);

    if(requestToken !== doc.refreshtoken){
        throw new Error("refresh token do not match");
    }

    doc.set({
        refreshtoken: "refresh token"
    })

    await doc.save();

}

const emailToken = (user) => {
    const key = process.env.EMAIL_TOKEN_KEY;
    const payload = {
        id: user._id,
        datecreated: new Date()
    }
    const options = {
        issuer: "Rubbles Tech",
        expiresIn: '5h'
    }

    return jwt.sign(payload, key, options);
}

const refreshTokenStore = async (user) => {
    const doc = await getRefreshToken(user._id);

    if (!doc) {
        await RefreshToken.create({
            userId: user._id
        })
    }
    else {
        throw new Error("refresh token store already exist")
    }
}



module.exports = { signAccessToken, signRefreshToken, signRefreshTokenPlus, verifyAccessToken, verifyRefreshToken, passwordResetToken, saveRefreshToken, resetRefreshToken, verifyGoogleToken, emailToken, refreshTokenStore };