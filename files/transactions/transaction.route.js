const transactionRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { initiatePaymentController } = require("./transaction.controller")

// transactionRoute.use(isAuthenticated)

//routes
transactionRoute.route("/").post(initiatePaymentController)

module.exports = transactionRoute
