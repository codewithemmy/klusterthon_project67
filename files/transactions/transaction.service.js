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

  static async verifyPayment(payload) {
    const { status, amount, transactionId, email, invoiceId } = payload
    const findTransaction = await TransactionRepository.findOneTransaction({
      amount,
      transactionId,
    })

    if (!findTransaction)
      return { success: false, msg: `unable to find transaction` }

    const transaction = await TransactionRepository.updateTransactionDetails(
      {
        _id: new mongoose.Types.ObjectId(findTransaction._id),
      },
      { status }
    )
    if (!transaction)
      return { success: false, msg: `unable to find transaction` }

    await InvoiceRepository.updateInvoiceDetails(
      { email, invoiceId },
      { status: "paid" }
    )

    return { success: true, msg: `Transaction Successfully Verified` }
  }
}

module.exports = { TransactionService }
