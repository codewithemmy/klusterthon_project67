const invoiceRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  createInvoiceController,
  getInvoiceController,
  updateInvoiceController,
  deleteInvoiceController,
  recipientInvoiceController,
} = require("./invoice.controller")

invoiceRoute.get("/recipient").get(recipientInvoiceController)
invoiceRoute.use(isAuthenticated)

//routes
invoiceRoute.route("/").post(createInvoiceController).get(getInvoiceController)
invoiceRoute
  .route("/:id")
  .patch(updateInvoiceController)
  .delete(deleteInvoiceController)

module.exports = invoiceRoute
