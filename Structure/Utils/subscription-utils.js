const { Subscription } = require('../Models/common-model');
const { getSub } = require('../Subscription/subscription-service');
const { SubArchive } = require('../Models/common-model');
const { getSubArchive, retrieveSubArchive } = require('../Subscription_Archive/sub-archive-service');

const assignSubscriptionToUser = async (user) => {
    const sub = await getSub(user._id);
    if (!sub) {
        const result = await Subscription.create({
            userId: user._id,
            email: user.email
        })
        return result;
    }
    return;
}


const assignSubArchiveToUser = async (user) => {
    const subArchive = await getSubArchive(user._id);
    if (!subArchive) {
        const result = await SubArchive.create({
            userId: user._id,
            email: user.email
        })
        return result;
    }
    return;
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