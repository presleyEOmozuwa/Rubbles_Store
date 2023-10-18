const shippo = require('shippo')(process.env.SHIPPO_SECRET_KEY);
const { addressFromHandler, addressToHandler } = require('./delivery.service');

const shippmentHandler = async () => {
    const addressFrom = await addressFromHandler();
    const addressTo = await addressToHandler();
    
    const shipment = shippo.shipment.create({
        "address_from": addressFrom,
        "address_to": addressTo,
        "parcels": parcel,
        "async": true
    })

    return shipment;
}

module.exports = { shippmentHandler }