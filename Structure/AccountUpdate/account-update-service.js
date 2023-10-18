const bcrypt = require('bcrypt');
const OldUserEmail = require('../Models/oldemail-model');


const getOldEmail = async (currEmail) => {
    const doc = await OldUserEmail.findOne({email: currEmail})

    return doc;
}

const passwordChecker = async (user, oldPassword) => {
    const match = await bcrypt.compare(oldPassword, user.password);
    return match;
}

const passwordHasher = async (newPassword) => {
    let hashedPassword = await bcrypt.hash(newPassword, 10)
    return hashedPassword
}

module.exports = { getOldEmail, passwordChecker, passwordHasher }