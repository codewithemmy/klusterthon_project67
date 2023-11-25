const { default: mongoose } = require("mongoose")
const { queryConstructor, AlphaNumeric } = require("../../utils")
const { TransactionRepository } = require("./transaction.repository")
const { InvoiceRepository } = require("../invoice/invoice.repository")
const { StripePaymentService } = require("../../providers/stripe/stripe")
const { LIMIT, SKIP, SORT } = require("../../constants")

class TransactionService {
  static paymentProvider

  static async getConfig() {
    this.paymentProvider = new StripePaymentService()
  }

  static async initiatePaymentTransaction(payload) {
    await this.getConfig()
    const { email, invoiceId, amount, paymentFor, currency } = payload

    const invoice = await InvoiceRepository.findSingleInvoiceWithParams({
      email,
      invoiceId,
      totalPrice: amount,
    })

    if (!invoice) return { success: false, msg: `Invoice not available` }

    const paymentDetails = await this.paymentProvider.initiatePaymentIntent({
      amount,
      currency,
    })

    if (!paymentDetails)
      return {
        success: false,
        msg: `unable to create stripe payment details`,
      }

    const paymentId = paymentDetails.data.data

    const { transactionId } = paymentId

    const transaction = await TransactionRepository.create({
      amount,
      currency,
      transactionId: transactionId,
      userId: new mongoose.Types.ObjectId(invoice.addedBy),
      paymentFor,
    })

    if (!transaction)
      return { success: false, msg: `unable to process transaction` }

    return paymentDetails
  }
}

module.exports = { TransactionService }

// export default class TransactionService {
//   private static paymentProvider: IPaymentProvider

//   static async getConfig() {
//     this.paymentProvider = new StripePaymentService()
//   }

//   static async initiatePayment(payload: {
//     amount: number
//     currency: string
//   }): Promise<IResponse> {
//     await this.getConfig()
//     const { amount, currency } = payload
//     const initializePayment = await this.paymentProvider.initiatePaymentIntent({
//       amount,
//       currency,
//     })

//     if (!initializePayment)
//       return {
//         success: false,
//         msg: transactionMessages.CREATE_TRANSACTION_FAILURE,
//       }

//     return initializePayment
//   }

//   static async verifyPayment(
//     payload: Partial<ITransaction>,
//     locals: any,
//   ): Promise<IResponse> {
//     const order = await OrderRepository.fetchOrder(
//       { _id: new mongoose.Types.ObjectId(payload.orderId) },
//       {},
//     )
//     if (!order)
//       return { success: false, msg: transactionMessages.PAYMENT_FAILURE }

//     if (order.totalAmount !== payload.amount)
//       return { success: false, msg: transactionMessages.PAYMENT_FAILURE }

//     const transaction = await TransactionRepository.create({
//       userId: new mongoose.Types.ObjectId(locals),
//       vendorId: new mongoose.Types.ObjectId(order.vendorId),
//       ...payload,
//     })

//     if (payload.status === "Succeeded") {
//       await OrderRepository.updateOrderDetails(
//         {
//           _id: new mongoose.Types.ObjectId(payload.orderId),
//         },
//         { $set: { transactionId: transaction._id, paymentStatus: "paid" } },
//       )
//     } else {
//       await OrderRepository.updateOrderDetails(
//         {
//           _id: new mongoose.Types.ObjectId(payload.orderId),
//         },
//         { $set: { transactionId: transaction._id, paymentStatus: "failed" } },
//       )
//     }
//     return { success: true, msg: transactionMessages.PAYMENT_SUCCESS }
//   }
// }
