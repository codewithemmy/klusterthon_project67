const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
    },
    billTo: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    paymentDue: {
      type: Date,
      required: true,
    },
    issuedOn: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    note: {
      type: String,
    },
    address: {
      type: String,
    },
    totalPrice: {
      type: Number,
    },
    services: {
      type: [{ item: String, qty: Number, price: Number }],
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

// Middleware to calculate and set totalPrice before saving
invoiceSchema.pre("save", function (next) {
  // Calculate the sum of prices in the services array
  const calculatedTotalPrice = this.services.reduce(
    (total, service) => total + service.price,
    0
  )

  // Set the totalPrice field
  this.totalPrice = calculatedTotalPrice

  // Continue with the save operation
  next()
})

const invoice = mongoose.model("Invoice", invoiceSchema, "invoice")

module.exports = { Invoice: invoice }
