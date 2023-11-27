const { Invoice } = require("./invoice.model")
const mongoose = require("mongoose")

class InvoiceRepository {
  static async create(payload) {
    return await Invoice.create(payload)
  }

  static async findInvoiceWithParams(invoicePayload, select) {
    return await Invoice.find({ ...invoicePayload }).select(select)
  }

  static async findSingleInvoiceWithParams(invoicePayload, select) {
    const invoice = await Invoice.findOne({ ...invoicePayload }).select(select)

    return invoice
  }

  static async validateInvoice(invoicePayload) {
    return Invoice.exists({ ...invoicePayload })
  }

  static async findAllInvoiceParams(invoicePayload) {
    const { limit, skip, sort, ...restOfPayload } = invoicePayload

    const invoice = await Invoice.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return invoice
  }

  static async updateInvoiceDetails(id, params) {
    return Invoice.findOneAndUpdate({ ...id }, { ...params }, { new: true })
  }

  static async deleteInvoiceDetails(id) {
    return Invoice.findByIdAndDelete({ ...id })
  }

  static async monthlyInvoiceAnalysis(id) {
    const monthlyTotals = await Invoice.aggregate([
      {
        $match: {
          status: "paid",
          addedBy: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" },
          },
          total: { $sum: "$totalPrice" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude default _id field
          monthYear: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: 1,
                },
              },
            },
          },
          total: 1,
        },
      },
    ])
    return monthlyTotals
  }
}

module.exports = { InvoiceRepository }
