const { Router } = require("express");
const { DepartmentController } = require("../../controllers/department");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { validationMiddleware } = require("../../middlewares/validation.middleware");
const { departmentValidator } = require("../../validators/department");

const departmentRouter = Router()

departmentRouter.post('/', [validationMiddleware(departmentValidator.createDepartment()), verifyToken], DepartmentController.createDepartment)
departmentRouter.get('/', DepartmentController.getDepartmentList)
departmentRouter.delete('/delete', [verifyToken], DepartmentController.deleteDepartment)
departmentRouter.post('/edit', [validationMiddleware(departmentValidator.editDepartment()), verifyToken], DepartmentController.editDepartment)

module.exports = { departmentRouter }