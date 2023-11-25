const clientRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

const {
  createClientController,
  getClientController,
  updateClientController,
  deleteClientController,
} = require("./client.controller")

clientRoute.use(isAuthenticated)

//routes
clientRoute.route("/").post(createClientController).get(getClientController)
clientRoute
  .route("/:id")
  .patch(updateClientController)
  .delete(deleteClientController)

module.exports = clientRoute
