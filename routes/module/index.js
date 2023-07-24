const { Router } = require("express");
const { ModuleController } = require("../../controllers/module");
const { verifyToken, verifyRole } = require("../../middlewares/auth.middleware");
const { validationMiddleware } = require("../../middlewares/validation.middleware");
const { moduleValidator } = require("../../validators/module");
const { QuizController } = require("../../controllers/quiz");

const moduleRouter = Router()

moduleRouter.post('/create', [validationMiddleware(moduleValidator.createModule()), verifyToken], ModuleController.createModule)
moduleRouter.post('/delete', [validationMiddleware(moduleValidator.deleteModule()), verifyToken], ModuleController.deleteModule)
moduleRouter.get('/', [verifyToken], ModuleController.getModules)
moduleRouter.post('/edit', [validationMiddleware(moduleValidator.editModule()), verifyToken], ModuleController.editModule)
moduleRouter.get('/progress', [verifyToken, verifyRole({ role: 'company' })], QuizController.getProgress)
moduleRouter.post('/progress', [verifyToken, verifyRole({ role: 'trainee' })], ModuleController.createProgressOfTrainee)
moduleRouter.put('/progress', [verifyToken, verifyRole({ role: 'trainee' })], ModuleController.setProgessOfTrainee)
moduleRouter.post('/certificate', [verifyToken, verifyRole({ role: 'trainee' })], QuizController.getCertificate)
moduleRouter.put('/certificate', [verifyToken, verifyRole({ role: 'company' })], QuizController.updateCertificate)

module.exports = { moduleRouter }