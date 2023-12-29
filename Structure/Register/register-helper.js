const stripe = require('stripe')(process.env.STRIPE_KEY);
const stripeCustomer = async (email) => {
    const customer = await stripe.customers.create({
        email: email
    });
    return customer;
}

module.exports = { stripeCustomer }