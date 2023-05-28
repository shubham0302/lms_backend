const { Router } = require("express");
const { UserController } = require("../../controllers/users");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { validationMiddleware } = require("../../middlewares/validation.middleware");
const { UserValidator } = require("../../validators/users");

const userRouter = Router()

userRouter.post('/register', [validationMiddleware(UserValidator.register()), verifyToken], UserController.register)
userRouter.post('/login', [validationMiddleware(UserValidator.login())], UserController.login)
userRouter.post('/change-password', [validationMiddleware(UserValidator.changePassword()), verifyToken], UserController.changePassword)
userRouter.post('/forgot-password', [validationMiddleware(UserValidator.forgotPassword())], UserController.forgotPassword)
userRouter.post('/verify-otp', [validationMiddleware(UserValidator.verifyOtp())], UserController.verifyOtp)
userRouter.post('/set-password', [validationMiddleware(UserValidator.setNewPassword())], UserController.setNewPassword)
userRouter.get('/get-users', [verifyToken], UserController.getUsers)
userRouter.get('/my-profile', [verifyToken], UserController.myProfile)
userRouter.post('/edit-profile', [validationMiddleware(UserValidator.editProfile()), verifyToken], UserController.editProfile)
userRouter.post('/edit-trainee', [verifyToken], UserController.editTrainee)
userRouter.delete('/delete', [verifyToken], UserController.deleteUser)

module.exports = { userRouter }