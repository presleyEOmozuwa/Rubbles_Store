require('dotenv').config({ path: "../../vars/.env" });
const stripe = require('stripe')(process.env.STRIPE_KEY);

const multipleSubscriptionItemsHandler = async (user, products) => {
    const line_items = products.map((product) => {
        return {
            price: product.priceId,
            quantity: product.quantity
        }
    });

    const session = await stripe.checkout.sessions.create({
        customer: user.stripecustomerid,
        line_items,
        mode: 'subscription',
        success_url: `${process.env.CLIENT_BASE_URL}/auth/checkout/sub/success/session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/auth/checkout/failure/sub/session_id={CHECKOUT_SESSION_ID}`,
    });

    return session;
}

module.exports = { multipleSubscriptionItemsHandler }