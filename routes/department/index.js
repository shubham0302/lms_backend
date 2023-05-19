const { Router } = require("express");
const { DepartmentController } = require("../../controllers/department");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { validationMiddleware } = require("../../middlewares/validation.middleware");
const { departmentValidator } = require("../../validators/department");

const departmentRouter = Router()

departmentRouter.post('/', [validationMiddleware(departmentValidator.createDepartment()), verifyToken], DepartmentController.createDepartment)

module.exports = { departmentRouter }