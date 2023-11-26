const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { InvoiceService } = require("./invoice.service")

const createInvoiceController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    InvoiceService.createInvoiceService(req.body, res.locals.jwt)
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getInvoiceController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    InvoiceService.getInvoiceService(req.query, res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateInvoiceController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    InvoiceService.updateInvoiceService(req.body, req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const deleteInvoiceController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    InvoiceService.deleteInvoiceService(req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}


const recipientInvoiceController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    InvoiceService.getInvoiceService(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}


module.exports = {
  createInvoiceController,
  getInvoiceController,
  updateInvoiceController,
  deleteInvoiceController, recipientInvoiceController
}
