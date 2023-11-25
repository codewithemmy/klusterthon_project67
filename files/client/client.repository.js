const { Client } = require("./client.model")
const mongoose = require("mongoose")

class ClientRepository {
  static async create(payload) {
    return await Client.create(payload)
  }

  static async findClientWithParams(clientPayload, select) {
    return await Client.find({ ...clientPayload }).select(select)
  }

  static async findSingleClientWithParams(clientPayload, select) {
    const client = await Client.findOne({ ...clientPayload }).select(select)

    return client
  }

  static async validateClient(clientPayload) {
    return Client.exists({ ...clientPayload })
  }

  static async findAllClientParams(clientPayload) {
    const { limit, skip, sort, ...restOfPayload } = clientPayload

    const client = await Client.find({ ...restOfPayload }, { password: 0 })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return client
  }

  static async updateClientDetails(id, params) {
    return Client.findOneAndUpdate({ ...id }, { ...params }, { new: true })
  }

  static async deleteClientDetails(id) {
    return Client.findByIdAndDelete({ ...id })
  }
}

module.exports = { ClientRepository }


