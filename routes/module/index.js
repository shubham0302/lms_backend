const { Router } = require("express");
const { ModuleController } = require("../../controllers/module");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { validationMiddleware } = require("../../middlewares/validation.middleware");
const { moduleValidator } = require("../../validators/module");

const moduleRouter = Router()

moduleRouter.post('/create', [validationMiddleware(moduleValidator.createModule()), verifyToken], ModuleController.createModule)
moduleRouter.delete('/delete', [validationMiddleware(moduleValidator.deleteModule()), verifyToken], ModuleController.deleteModule)
moduleRouter.get('/', [verifyToken], ModuleController.getModules)
moduleRouter.post('/edit', [validationMiddleware(moduleValidator.editModule()), verifyToken], ModuleController.editModule)

module.exports = { moduleRouter }