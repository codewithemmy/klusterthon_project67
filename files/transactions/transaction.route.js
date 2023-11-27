const transactionRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  initiatePaymentController,
  verifyPaymentController,
  transactionAnalysisController,
  monthlyAnalysisController,
} = require("./transaction.controller")

//routes
transactionRoute.route("/").post(initiatePaymentController)
transactionRoute.route("/verify").post(verifyPaymentController)

transactionRoute.use(isAuthenticated)

transactionRoute.route("/analysis").get(transactionAnalysisController)
transactionRoute.route("/analysis/monthly").get(monthlyAnalysisController)

module.exports = transactionRoute
