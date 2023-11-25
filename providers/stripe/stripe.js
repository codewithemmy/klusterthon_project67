const { mongoose } = require("mongoose")
const { IResponse } = require("../../constants")
const { providerMessages } = require("../providers.messages")
const { stripePaymentIntent } = require("../../utils/stripe")

class StripePaymentService {
  async initiatePaymentIntent(paymentPayload) {
    const { amount, currency } = paymentPayload

    const stripe = await stripePaymentIntent({ amount, currency })

    if (!stripe)
      return { success: false, msg: providerMessages.INITIATE_PAYMENT_FAILURE }

    return {
      success: true,
      msg: providerMessages.INITIATE_PAYMENT_SUCCESS,
      data: stripe,
    }
  }
}

module.exports = { StripePaymentService }
