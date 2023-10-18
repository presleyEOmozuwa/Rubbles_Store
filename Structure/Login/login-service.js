const bcrypt = require('bcrypt');
require('dotenv').config({ path: "../../vars/.env" });
const User = require('../Models/user-model');
const DeletedUser = require('../Models/deleted-user-model');
const BlockedUser = require('../Models/blocked-user-model');



const loginUser = async (email, password) => {
    let con = { };

    if(!email && !password){
        throw new Error("login data not found");
    }

    const delUser = await DeletedUser.findOne({ email: email });

    if(delUser){
        throw new Error("user account is closed");
    }

    const blockeduser = await BlockedUser.findOne({ email: email });

    if(blockeduser){
        throw new Error("user account has been blocked");
    }

    // FIND USER BY EMAIL
    const user = await User.findOne({ email: email });
    
    
    if(!user){
        throw new Error("invalid email or password");
    }

    // IF USER FOUND, VERIFY PASSWORD
    const comparePassword = await bcrypt.compare(password, user.password);

    if(!comparePassword){
        throw new Error("invalid email or password");
    }

    con.authUser = user;
    
    return con;
}


module.exports = { loginUser };