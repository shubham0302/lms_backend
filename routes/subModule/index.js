const { Router } = require("express");
const { SubModuleController } = require("../../controllers/subModule");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { validationMiddleware } = require("../../middlewares/validation.middleware");
const { subModuleValidator } = require("../../validators/subModule");

const subModuleRouter = Router()

subModuleRouter.post('/create', [validationMiddleware(subModuleValidator.createSubModule()), verifyToken], SubModuleController.createSubModule)
subModuleRouter.post('/edit', [validationMiddleware(subModuleValidator.editSubModule()), verifyToken], SubModuleController.editSubModule)
subModuleRouter.delete('/delete', [validationMiddleware(subModuleValidator.deleteSubModule()), verifyToken], SubModuleController.deleteSubModule)
subModuleRouter.get('/', [verifyToken], SubModuleController.getSubModules)
subModuleRouter.get('/details', [verifyToken], SubModuleController.getSingleSubModule)

module.exports = { subModuleRouter }