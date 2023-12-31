require('dotenv').config({ path: "../../vars/.env" });
const stripe = require('stripe')(process.env.STRIPE_KEY);

const singleRegularItemHandler = async (user, cartItems) => {
    const line_items = cartItems.map((item) => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.prodName,
                },
                unit_amount: Math.floor(item.newPrice * 100)
            },
            quantity: item.quantity,
        }
    });
    const session = await stripe.checkout.sessions.create({
        customer: user.stripecustomerid,
        line_items,
        mode: 'payment',
        success_url: `${process.env.CLIENT_BASE_URL}/auth/multiple/checkout/success/session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/auth/checkout/failure/multiple/session_id={CHECKOUT_SESSION_ID}`,
    });

    return session;
}

module.exports = { singleRegularItemHandler }