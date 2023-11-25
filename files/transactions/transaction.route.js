const transactionRoute = require("express").Router()
const {
  initiatePaymentController,
  verifyPaymentController,
} = require("./transaction.controller")

//routes
transactionRoute.route("/").post(initiatePaymentController)
transactionRoute.route("/verify").post(verifyPaymentController)

module.exports = transactionRoute
