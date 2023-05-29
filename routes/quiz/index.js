const { Router } = require("express");
const { QuizController } = require("../../controllers/quiz");
const { QuizValidator } = require("../../validators/quiz");
const {
  validationMiddleware,
} = require("../../middlewares/validation.middleware");
const {
  verifyToken,
  verifyRole,
} = require("../../middlewares/auth.middleware");

const quizRouter = Router();

quizRouter.post(
  "/create",
  [
    validationMiddleware(QuizValidator.createQuiz()),
    verifyToken,
    verifyRole({
      isCompany: true,
    }),
  ],
  QuizController.createQuiz
);
quizRouter.post(
  "/appear",
  [
    validationMiddleware(QuizValidator.appearForQuiz()),
    verifyToken,
    verifyRole({
      role: "trainee",
    }),
  ],
  QuizController.appearQuiz
);
quizRouter.post(
  "/evaluate",
  [
    validationMiddleware(QuizValidator.appearForQuiz()),
    verifyToken,
    verifyRole({
      // role: 'trainee',
      isCompany: true,
    }),
  ],
  QuizController.evaluateQuiz
);
quizRouter.get("/form", [verifyToken], QuizController.getQuiz);
quizRouter.get(
  "/form/list",
  [
    verifyToken,
    verifyRole({
      isCompany: true,
    }),
  ],
  QuizController.getAppearTraineeList
);
quizRouter.get(
  "/form/list/details",
  [
    verifyToken,
    verifyRole({
      isCompany: true,
    }),
  ],
  QuizController.getAppear
);

module.exports = {
  quizRouter,
};
