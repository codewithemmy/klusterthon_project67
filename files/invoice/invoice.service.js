const { default: mongoose } = require("mongoose")
const { queryConstructor, AlphaNumeric } = require("../../utils")
const { InvoiceSuccess, InvoiceFailure } = require("./invoice.messages")
const { InvoiceRepository } = require("./invoice.repository")
const { sendMailNotification } = require("../../utils/email")
const { LIMIT, SKIP, SORT } = require("../../constants")

class InvoiceService {
  static async createInvoiceService(payload, jwt) {
    const { email } = payload
    let randomNumber = AlphaNumeric(6, "number")

    let invoiceId = `#${randomNumber}`

    const invoice = await InvoiceRepository.create({
      invoiceId,
      addedBy: new mongoose.Types.ObjectId(jwt._id),
      ...payload,
    })

    if (!invoice) return { success: false, msg: InvoiceFailure.UPDATE }

    const substitutional_parameters = {
      url: `${process.env.URL}/invoices/view/${invoice._id}`,
      name: payload.billTo,
      due: payload.paymentDue,
      price: invoice.totalPrice,
    }

    await sendMailNotification(
      email,
      "Invoice from Klusterthon",
      substitutional_parameters,
      "INVOICE"
    )

    return {
      success: true,
      msg: InvoiceSuccess.CREATE,
    }
  }

  static async getInvoiceService(clientPayload, jwt) {
    const { error, params, limit, skip, sort } = queryConstructor(
      clientPayload,
      "createdAt",
      "Invoice"
    )
    if (error) return { success: false, msg: error }

    let user
    if (jwt) {
      user = { addedBy: new mongoose.Types.ObjectId(jwt) }
    }

    console.log("jwt", user)
    const invoice = await InvoiceRepository.findAllInvoiceParams({
      ...params,
      limit,
      skip,
      sort,
      ...user,
    })

    if (invoice.length < 1) return { success: false, msg: InvoiceFailure.FETCH }

    return { success: true, msg: InvoiceSuccess.FETCH, data: invoice }
  }

  static async updateInvoiceService(body, locals) {
    const updateInvoice = await InvoiceRepository.updateInvoiceDetails(
      { _id: new mongoose.Types.ObjectId(locals) },
      {
        ...body,
      }
    )

    if (!updateInvoice) return { success: false, msg: InvoiceFailure.UPDATE }

    return { success: true, msg: InvoiceSuccess.UPDATE }
  }

  static async deleteInvoiceService(locals) {
    const deleteInvoice = await InvoiceRepository.deleteInvoiceDetails({
      _id: new mongoose.Types.ObjectId(locals),
    })

    if (!deleteInvoice) return { success: false, msg: InvoiceFailure.DELETE }

    return { success: true, msg: InvoiceSuccess.DELETE }
  }
}

module.exports = { InvoiceService }
