const LocationTracker = require('../Models/location-tracker-model');
const DeletedUser = require('../Models/deleted-user-model');
const BlockedUser = require('../Models/blocked-user-model');
const { getAppUser } = require('../AppUser/appuser-service');
const { retrieveOrderArchive } = require('../Order_Archive/order-archive-service');


// SAVE USER'S SESSION ID AT THE TIME OF REGISTRATION
const locationTracker = async (user, sessionId) => {
    const locationTracker = await LocationTracker.findOne({ email: user.email });

    if (!locationTracker || Object.values(locationTracker).length === 0) {
        const result = await LocationTracker.create({
            userId: user._id,
            email: user.email,
            locationId: sessionId ? sessionId : "location not found"
        });
        return result;
    }

    return;
}

// REMOVE USER LOCATION DATA
const removeFromLocation = async (removedUser) => {
    const location = await LocationTracker.findOne({ userId: removedUser._id });
    if (location) {
        await location.deleteOne();
    }
    return;
}

// CLEAR OUT ALL DELETED USERS
const clearAllDeletedUsers = async () => {
    const delUsers = await DeletedUser.find();

    if (delUsers.length === 0) {
        throw new Error("already cleared out");
    }

    delUsers.forEach(async (user) => {
        await user.deleteOne();
    })
}

const clearLocationUsers = async () => {
    const delLocation = await LocationTracker.findAll();

    if (delLocation.length === 0) {
        throw new Error("already cleared out");
    }

    delLocation.forEach(async (location) => {
        await location.deletOne();
    })
}


// SAVE DELETED USERS TO DB
const saveDeletedUser = async (removedUser) => {
    const delUser = await DeletedUser.findOne({ userId: removedUser._id });

    if (!delUser) {
        await DeletedUser.create({
            userId: removedUser.id,
            email: removedUser.email,
            username: removedUser.username
        })
    }

    return delUser;

}

// DEACTIVATE USER ACCOUNT
const blockUserService = async (userId) => {
    let con = {};

    const user = await getAppUser(userId);

    const blockeduser = await BlockedUser.findOne({ userId: user._id });

    if (blockeduser) {
        throw new Error("user already blocked");
    }

    await BlockedUser.create({
        userId: user._id,
        email: user.email,
        role: user.role
    });

    con.sealedUser = user;

    return con;

}

// REACTIVATE USER ACCOUNT
const unblockUserService = async (userId) => {
    let con = {};

    const user = await getAppUser(userId);

    const blockeduser = await BlockedUser.findOne({ userId: user._id });

    if (!blockeduser) {
        throw new Error("user already unblocked");
    }

    await blockeduser.deleteOne();

    con.unsealedUser = user;

    return con;

}

const clearOrdersFromArchive = async (userId) => {
    const orderArchive = await retrieveOrderArchive(userId);

    if (orderArchive.orders.length === 0) {
        throw new Error("orders already cleared out");
    }

    orderArchive.set({
        orders: []
    })

    await orderArchive.save();
}




module.exports = { locationTracker, saveDeletedUser, blockUserService, unblockUserService, removeFromLocation, clearAllDeletedUsers, clearLocationUsers, clearOrdersFromArchive }