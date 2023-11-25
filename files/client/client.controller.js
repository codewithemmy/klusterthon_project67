const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { ClientService } = require("./client.service")

const createClientController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ClientService.createClientService(req.body, res.locals.jwt)
  )
  console.log("error", error)
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getClientController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ClientService.getClientService(req.query, res.locals.jwt._id)
  )
  
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createClientController,
  getClientController,
}
