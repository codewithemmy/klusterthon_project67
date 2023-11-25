const stripe = require("stripe")(process.env.STRIPE_KEY)

const stripePaymentIntent = async (payload) => {
  const { amount, currency } = payload

  if (!amount && !currency)
    return { success: false, msg: transactionMessages.AMOUNT_CURRENCY }

  const paymentIntent = await stripe.paymentIntents.create({ amount, currency })

  return {
    success: true,
    msg: transactionMessages.PAYMENT_SUCCESS,
    data: {
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
    },
  }
}

module.exports = { stripePaymentIntent }
