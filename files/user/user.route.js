const { uploadManager } = require("../../utils/multer")
const { checkSchema } = require("express-validator")
const userRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { validate } = require("../../validations/validate")

//controller files
const {
  createUserController,
  userLoginController,
} = require("../user/controllers/user.controller")
const { getUserProfileController } = require("./controllers/profile.controller")

const { loginValidation } = require("../../validations/users/loginValidation")

//routes
userRoute.route("/").post(createUserController)

userRoute
  .route("/login")
  .post(validate(checkSchema(loginValidation)), userLoginController)

userRoute.route("/").get(getUserProfileController)

userRoute.use(isAuthenticated)

module.exports = userRoute
