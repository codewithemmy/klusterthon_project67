const clientRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

const {
  createClientController,
  getClientController,
} = require("./client.controller")

clientRoute.use(isAuthenticated)

//routes
clientRoute.route("/").post(createClientController).get(getClientController)

module.exports = clientRoute
