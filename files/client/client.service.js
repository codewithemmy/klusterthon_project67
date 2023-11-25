const { default: mongoose } = require("mongoose")
const { queryConstructor, AlphaNumeric } = require("../../utils")
const { ClientSuccess, ClientFailure } = require("./client.messages")
const { ClientRepository } = require("./client.repository")
const { LIMIT, SKIP, SORT } = require("../../constants")

class ClientService {
  static async createClientService(payload, jwt) {
    let randomNumber = AlphaNumeric(5, "number")

    let clientId = `#${randomNumber}`

    const client = await ClientRepository.create({
      clientId,
      addedBy: new mongoose.Types.ObjectId(jwt._id),
      ...payload,
    })

    if (!client) return { success: false, msg: ClientFailure.UPDATE }

    return {
      success: true,
      msg: ClientSuccess.CREATE,
    }
  }

  static async getClientService(clientPayload, jwt) {
    const { error, params, limit, skip, sort } = queryConstructor(
      clientPayload,
      "createdAt",
      "Client"
    )
    if (error) return { success: false, msg: error }

    let user = { addedBy: new mongoose.Types.ObjectId(jwt) }

    const client = await ClientRepository.findAllClientParams({
      ...params,
      limit,
      skip,
      sort,
      ...user,
    })

    if (client.length < 1) return { success: false, msg: ClientFailure.FETCH }

    return { success: true, msg: ClientSuccess.FETCH, data: client }
  }

  static async updateClientService(body, locals) {
    const client = await ClientRepository.findSingleClientWithParams({
      _id: locals._id,
    })

    if (!client) return { success: false, msg: ClientFailure.UPDATE }

    const updateClient = await ClientRepository.updateClientDetails(
      { _id: locals._id },
      {
        ...body,
      }
    )

    if (!updateClient) return { success: false, msg: ClientFailure.UPDATE }

    return { success: true, msg: ClientSuccess.UPDATE }
  }
}

module.exports = { ClientService }
