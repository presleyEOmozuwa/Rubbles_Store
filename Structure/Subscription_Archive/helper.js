const { retrieveSubArchive } = require('./sub-archive-service')
require('dotenv').config({path: "../../vars/.env"})
const stripe = require('stripe')(process.env.STRIPE_KEY);


const addItemNamesToList = async (checkoutSessionId) => {
    const subArchive = await retrieveSubArchive(user._id);
    
    const { subNames } = subArchive;
    
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);

    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

    const invoice = await stripe.invoices.retrieve(
        paymentIntent.invoice
    );

    invoice.lines.data.forEach(async (item) => {
        const prod = await stripe.products.retrieve(item.price.product)
    
        const modified = [...subNames, prod.name]

        subArchive.set({
            subNames: modified
        })
    
        await subArchive.save();
    })

}

module.exports = { addItemNamesToList }