const stripe = require("stripe")(process.env.STRIPE_KEY)

const stripePaymentIntent = async (payload) => {
  const { amount, currency } = payload

  if (!amount && !currency)
    return { success: false, msg: `amount and currency cannot be empty` }

  const paymentIntent = await stripe.paymentIntents.create({ amount, currency })

  return {
    success: true,
    msg: `payment process successful`,
    data: {
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
    },
  }
}

module.exports = { stripePaymentIntent }
