// //WEBHOOK POST REQUEST FROM STRIPE
const handleOrder = async (data, lineItems) => {
    console.log(data);
    console.log(lineItems);
}

let endpointSecret;
// endpointSecret = process.env.WHSEC;

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let data;
    let eventType;

    if (endpointSecret) {
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("Webhook verified");
        }
        catch (err) {
            console.log(`Webhook Error: ${err.message}`);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        data = event.data.object;
        eventType = event.type;
        if (eventType === 'checkout.session.completed') {
            stripe.checkout.sessions.listLineItems(
                data.id,
                { limit: 10 },
                async (err, lineItems) => {
                    if (err) {
                        throw new Error(err.message);
                    }
                    else {
                        await handleOrder(data, lineItems);
                    }
                }
            );
        }

        // if(eventType === "checkout.session.completed"){
        //     stripe.customers.retrieve(data.customer).then(async (customer) => {
        //         await createOrder(customer, data);
        //     }).catch((err) => {
        //         console.log(err.message);
        //     });
        // }
    }
    else {
        data = req.body.data.object;
        eventType = req.body.type;
    }

    res.send().end();
})    