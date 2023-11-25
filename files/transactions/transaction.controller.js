const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { TransactionService } = require("./transaction.service")

const initiatePaymentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    TransactionService.initiatePaymentTransaction(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  initiatePaymentController,
}
