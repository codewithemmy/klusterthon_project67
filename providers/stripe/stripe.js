const { mongoose } = require("mongoose")
const { IResponse } = require("../../constants")
const { stripePaymentIntent } = require("../../utils/stripe")
const { UserRepository } = require("../../files/user/user.repository")
const stripe = require("stripe")(process.env.STRIPE_KEY)

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

  checkSuccessStatus(status, gatewayResponse) {
    if (status === "success") return { success: true, msg: gatewayResponse }

    return { success: false, msg: gatewayResponse }
  }

  async createCheckOutSession(paymentPayload) {
    const { priceId, quantity, userId, uuid } = paymentPayload

    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(userId),
    })

    if (!user) return { success: false, msg: `user not found` }

    try {
      if (!user.stripeCustomerId) {
        //- create stripe customer and save if not created to stripe side yet
        let stripeCustomer = await stripe.customers.create({
          email: user.email,
        })

        user.stripeCustomerId = stripeCustomer.id
        await user.save()
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: quantity,
          },
        ],
        customer: user.stripeCustomerId,
        mode: `payment`,
        success_url: `${process.env.STRIPE_SUCCESS_CALLBACK}/user/payment-success?userId=${user._id}&uuid=${uuid}`,
        cancel_url: `${process.env.STRIPE_CANCEL_CALLBACK}/user/service?userId=${user._id}&uuid=${uuid}`,
      })

      return session
    } catch (error) {
      return { success: false, msg: error.message }
    }
  }

  async retrieveCheckOutSession(payload) {
    try {
      const session = await stripe.checkout.sessions.retrieve(`${payload}`)
      return session
    } catch (error) {
      console.log("error", error.message)
    }
  }
}

module.exports = { StripePaymentService }
