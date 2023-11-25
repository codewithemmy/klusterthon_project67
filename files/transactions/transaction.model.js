const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
    },
    channel: {
      type: String,
      required: true,
      enum: ["stripe"],
      default: "stripe",
    },
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Failed", "Succeeded", "Pending", "Canceled"],
      default: "Pending",
    },
    paymentFor: {
      type: String,
    },
    metaData: String,
    isDelete: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
)

const transaction = mongoose.model(
  "Transaction",
  transactionSchema,
  "transaction"
)

module.exports = { Transaction: transaction }
