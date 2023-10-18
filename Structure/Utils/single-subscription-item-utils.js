require('dotenv').config({ path: "../../vars/.env" });
const stripe = require('stripe')(process.env.STRIPE_KEY);

const singleSubscriptionItemHandler = async (user, cartItems) => {
    const product = cartItems[0];
    
    const session = await stripe.checkout.sessions.create({
        customer: user.stripecustomerid,
        line_items: [
            { price: product.priceId, quantity: product.quantity }
        ],
        mode: 'subscription',
        success_url: `${process.env.CLIENT_BASE_URL}/auth/sub/multiple/checkout/success/session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/auth/checkout/failure/sub/multiple/session_id={CHECKOUT_SESSION_ID}`,

    });

    return session;
}

module.exports = { singleSubscriptionItemHandler }