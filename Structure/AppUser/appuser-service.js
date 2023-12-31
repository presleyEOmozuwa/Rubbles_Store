const User = require('../Models/user-model');
const { passwordHasher } = require('../AccountUpdate/account-update-service');


// GET ALL USERS
const getAllUsers = async () => {
    const users = await User.find();

    if (!users) {
        throw new Error("user list request failed");
    }

    return users;
}

// GET SINGLE USER BY ID
const getAppUser = async (userId) => {
    const user = await User.findOne({ _id: userId });

    if (!user) {
        throw new Error("user not found");
    }

    return user;
}

// GET SINGLE USER BY ID
const getUserByEmail = async (email) => {
    const user = await User.findOne({ email: email });

    if (!user) {
        throw new Error("user not found");
    }

    return user;
}

// GET USER BY STRIPE ID
const getUserByStripeId = async (customerId) => {
    const user = await User.findOne({ stripecustomerid: customerId });

    if (!user) {
        throw new Error("user not found");
    }

    return user;
}


// UPDATE A USER
const upDateUser = async (userId, payload) => {
    const user = await getAppUser(userId);
    user.set({
        username: payload.username,
        email: payload.email
    })

    const upDatedUser = await user.save()

    if (!upDatedUser) {
        throw new Error("user update failed");
    }
    return upDateUser;
}

const upDateUserName = async (user, username) => {
    user.set({
        username: username,
    })

    const update = await user.save()

    if (!update) {
        throw new Error("username update failed");
    }
    return update;
}

const upDateEmail = async (user, currEmail) => {
    user.set({
        email: currEmail
    })

    const update = await user.save();

    if (!update) {
        throw new Error("username update failed");
    }
    
    return update;
}

const upDatePassword = async (user, newPassword) => {
    
    const pass = await passwordHasher(newPassword);
    
    user.set({
        password: pass
    })

    const update = await user.save();

    if (!update) {
        throw new Error("password change failed");
    }
    
    return update;
}


// DELETE A USER
const deleteUser = async (id) => {
    let con = { isDeleted: false };
    const user = await getAppUser(id);
    await user.deleteOne();
    con.isDeleted = true;
    con.removedUser = user;

    return con;
}


module.exports = { getAllUsers, getAppUser, getUserByEmail, getUserByStripeId, upDateUser, upDateUserName, upDatePassword, upDateEmail, deleteUser }