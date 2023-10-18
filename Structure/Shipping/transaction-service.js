const shippo = require('shippo')(process.env.SHIPPO_API_TOKEN);

const { shippmentHandler } = require('./shipment-service');

const transactionHandler = async () => {
    const shipment = await shippmentHandler();
    const rate = shipment.rates[0];
    const transaction = await shippo.transaction.create({
        "rate": rate.object_id,
        "label_file_type": "PDF",
        "async": true
    })

    return transaction;

}

module.exports = { transactionHandler }