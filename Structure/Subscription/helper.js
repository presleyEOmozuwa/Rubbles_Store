const { retrieveSubArchive } = require('../Subscription_Archive/sub-archive-service')

const itemNameChecker = async (user, products) => {
    let items;
    
    const subArchive = await retrieveSubArchive(user._id);
    const { subNames } = subArchive;
    
    if(subNames){
        items = products.filter((item) => {
            if(subNames.includes(item.prodName)){
                throw new Error("you cannot subscribe to the same item twice");
            }
            else{
                return true;
            }
        })
    }

    return items;
}


module.exports = { itemNameChecker}