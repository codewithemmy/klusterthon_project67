const userRoute = require("../files/user/user.route")
const authRoute = require("../files/auth/auth.route")
const notificationRoute = require("../files/notification/notification.route")
const adminRoute = require("../files/admin/admin.routes")
const clientRoute = require("../files/client/client.route")
const invoiceRoute = require("../files/invoice/invoice.route")
const transactionRoute = require("../files/transactions/transaction.route")

const routes = (app) => {
  const base_url = "/api/v1"

  app.use(`${base_url}/user`, userRoute)
  app.use(`${base_url}/auth`, authRoute)
  app.use(`${base_url}/notification`, notificationRoute)
  app.use(`${base_url}/admin`, adminRoute)
  app.use(`${base_url}/client`, clientRoute)
  app.use(`${base_url}/invoice`, invoiceRoute)
  app.use(`${base_url}/transaction`, transactionRoute)
}

module.exports = routes
