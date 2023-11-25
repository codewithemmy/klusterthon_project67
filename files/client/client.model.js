const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    billingAddress: {
      type: String,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const client = mongoose.model("Client", clientSchema, "client")

module.exports = { Client: client }
