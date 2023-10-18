const shippo = require('shippo')(process.env.SHIPPO_SECRET_KEY);

const addressFromHandler = async () => {
    const addressFrom  = shippo.address.create({
        "name":"Shawn Ippotle",
        "company":"Shippo",
        "street1":"215 Clayton St.",
        "city":"San Francisco",
        "state":"CA",
        "zip":"94117",
        "country":"US", 
        "phone":"+1 555 341 9393",
        "email":"shippotle@goshippo.com"
    })

    return addressFrom;
}

const addressToHandler = async () => {
    const addressTo = shippo.address.create({
        "name":"Ms Hippo",
        "company":"Shippo",
        "street1":"803 Clayton St.",
        "city":"San Francisco",
        "state":"CA",
        "zip":"94117",
        "country":"US",
        "phone":"+1 555 341 9393",
        "email":"support@goshippo.com"
    })
    
    return addressTo;
}


module.exports = { addressFromHandler,  addressToHandler } 