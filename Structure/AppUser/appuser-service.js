const User = require('../Models/user-model');

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
        throw new Error("invalid email or password");
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
    const user = await getAppUser(userId)
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

// DELETE A USER
const deleteUser = async (id) => {
    let con = { isDeleted: false };
    const user = await getAppUser(id);
    await user.deleteOne();
    con.isDeleted = true;
    con.removedUser = user;

    return con;
}


module.exports = { getAllUsers, getAppUser, getUserByEmail, getUserByStripeId, upDateUser, deleteUser }