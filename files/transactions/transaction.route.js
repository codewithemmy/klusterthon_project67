const transactionRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  initiatePaymentController,
  verifyPaymentController,
  transactionAnalysisController,
} = require("./transaction.controller")

//routes
transactionRoute.route("/").post(initiatePaymentController)
transactionRoute.route("/verify").post(verifyPaymentController)

transactionRoute.use(isAuthenticated)

transactionRoute.route("/analysis").get(transactionAnalysisController)

module.exports = transactionRoute
