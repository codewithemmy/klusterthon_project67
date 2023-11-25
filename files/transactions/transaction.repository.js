const { Transaction } = require("./transaction.model")

class TransactionRepository {
  static async create(payload) {
    return await Transaction.create(payload)
  }

  static async findOneTransaction(payload) {
    return await Transaction.findOne({ ...payload })
  }

  static async findTransactionWithParams(TransactionPayload, select) {
    return await Transaction.find({ ...TransactionPayload }).select(select)
  }

  static async findSingleTransactionWithParams(TransactionPayload, select) {
    const Transaction = await Transaction.findOne({
      ...TransactionPayload,
    }).select(select)

    return Transaction
  }

  static async validateTransaction(TransactionPayload) {
    return Transaction.exists({ ...TransactionPayload })
  }

  static async findAllTransactionParams(TransactionPayload) {
    const { limit, skip, sort, ...restOfPayload } = TransactionPayload

    const Transaction = await Transaction.find(
      { ...restOfPayload },
      { password: 0 }
    )
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return Transaction
  }

  static async updateTransactionDetails(id, params) {
    return Transaction.findOneAndUpdate({ ...id }, { ...params }, { new: true })
  }

  static async deleteTransactionDetails(id) {
    return Transaction.findByIdAndDelete({ ...id })
  }
}

module.exports = { TransactionRepository }
