const bcrypt = require('bcrypt');
const User = require('../Models/user-model');
const DeletedUser = require('../Models/deleted-user-model');
const BlockedUser = require('../Models/blocked-user-model');


const loginUser = async (email, password) => {
    
    if(!email || !password){
        throw new Error("email and password fields are required");
    }

    const delUser = await DeletedUser.findOne({ email: email });
    
    if(delUser){
        throw new Error("email is associated to a closed account");
    }

    const blockeduser = await BlockedUser.findOne({ email: email });

    if(blockeduser){
        throw new Error("email is associated to a blocked account");
    }

    // FIND USER BY EMAIL
    const authUser = await User.findOne({ email: email });
    
    if(!authUser){
        throw new Error("invalid email or password");
    }

    // IF USER FOUND, VERIFY PASSWORD
    const comparePassword = await bcrypt.compare(password, authUser.password);

    if(!comparePassword){
        throw new Error("invalid email or password");
    }

    return authUser;
}


module.exports = { loginUser };