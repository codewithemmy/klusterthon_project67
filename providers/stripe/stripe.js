const { mongoose } = require("mongoose")
const { IResponse } = require("../../constants")
const { stripePaymentIntent } = require("../../utils/stripe")

class StripePaymentService {
  async initiatePaymentIntent(paymentPayload) {
    const { amount, currency } = paymentPayload

    const stripe = await stripePaymentIntent({ amount, currency })

    if (!stripe) return { success: false, msg: `unable to initiate payment` }

    return {
      success: true,
      msg: `Payment initiation successful`,
      data: stripe,
    }
  }
}

module.exports = { StripePaymentService }
