const { Subscription } = require('../Models/common-model');
const { getSub } = require('../Subscription/subscription-service');
const { SubArchive } = require('../Models/common-model');
const { getSubArchive, retrieveSubArchive } = require('../Subscription_Archive/sub-archive-service');

const assignSubscriptionToUser = async (user) => {
    const sub = await getSub(user._id);

    if (!sub) {
        await Subscription.create({
            userId: user._id
        })
    }
    else {
        throw new Error("subscription already exist")
    }
}


const assignSubArchiveToUser = async (user) => {
    const subArchive = await getSubArchive(user._id);

    if (!subArchive) {
        await SubArchive.create({
            userId: user._id
        })
    }
    else {
        throw new Error("order archive already exist")
    }
}

const addSubToSubArchive = async (user, updatedSub) => {
    const subArchive  = await retrieveSubArchive(user._id);
    
    await SubArchive.findByIdAndUpdate(
        subArchive._id,
        { $push: { subscriptions: [updatedSub] } },
        { new: true }
    );
}


const addSubToOrder = async (subId, item) => {
    await Subscription.findByIdAndUpdate(
        subId,
        { $addToSet: { subItems: [item] } },
        { new: true }
    );
}


module.exports = { assignSubArchiveToUser, assignSubscriptionToUser, addSubToSubArchive, addSubToOrder }