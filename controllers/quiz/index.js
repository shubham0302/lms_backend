const ResponseWraper = require("../../helpers/response.helper");
const { Quiz, QuizForm, QuizAttempt } = require("../../models/quiz");
const { SubModule } = require("../../models/subModule");

class QuizController {
  static async createQuiz(req, res) {
    const response = new ResponseWraper(res);
    try {
      const { submodule, quizForm, cutoff, cutoffispercent } = req.body;
      const submoduleDetails = await SubModule.findById(submodule);
      const form = await QuizForm.create({
        name: submoduleDetails.subModuleName,
        cutoff,
        cutoffispercent,
        submodule,
      });
      const request = quizForm.map((e) => ({ ...e, form }));
      const quiz = await Quiz.create(request);
      response.created(quiz);
    } catch (error) {
      console.log(error);
      return response.internalServerError();
    }
  }

  static async getQuiz(req, res) {
    const response = new ResponseWraper(res);
    try {
      const { form } = req.query;
      const formDetails = await QuizForm.findById(form);
      const quiz = await Quiz.find({
        form,
      });

      return response.ok({
        formDetails,
        quiz,
      });
    } catch (error) {
      return response.internalServerError();
    }
  }

  static async getAppearTraineeList(req, res) {
    const response = new ResponseWraper(res);
    try {
      const { submodule } = req.query;
      const formDetails = await QuizForm.findOne({
        submodule,
      });

      const attempts = await QuizAttempt.find({
        form: formDetails,
      }).populate("trainee");

      const resp = [];

      for (let index = 0; index < attempts.length; index++) {
        const element = attempts[index];
        if (resp.findIndex((el) => el._id === element._id) === -1) {
          resp.push(element.trainee);
        }
      }

      // const resp = attempts.reduce((a,b)=>{

      // },);

      return response.ok(resp);
    } catch (error) {
      return response.internalServerError();
    }
  }

  static async getAppear(req, res) {
    const response = new ResponseWraper(res);
    try {
      const { submodule, trainee } = req.query;
      const formDetails = await QuizForm.findOne({
        submodule,
      });

      const questions = await Quiz.find({
        form: formDetails,
      });
      const attempts = await QuizAttempt.find({
        form: formDetails,
        trainee,
      });

      if (questions.length !== attempts.length) {
        return response.badRequest("Question does not match appear");
      }

      const resp = questions.map((e) => ({
        ...e,
        answerId: attempts.find((el) => el.question === e._id)._id,
        answer: attempts.find((el) => el.question === e._id).answer,
        remarks: attempts.find((el) => el.question === e._id).remarks,
        evaluate: attempts.find((el) => el.question === e._id).evaluate,
      }));

      return response.ok({
        formDetails,
        formFields: resp,
      });
    } catch (error) {
      return response.internalServerError();
    }
  }

  static async appearQuiz(req, res) {
    const response = new ResponseWraper(res);
    try {
      const {
        quizForm,
        answers,
        decodedId,
        // decodedRole
      } = req.body;

      const answerSchema = answers.map((e) => ({
        ...e,
        form: quizForm,
        trainee: decodedId,
      }));

      const result = await QuizAttempt.create(answerSchema);

      return response.created(result);
    } catch (error) {
      return response.internalServerError();
    }
  }

  static async evaluateQuiz(req, res) {
    const response = new ResponseWraper(res);
    try {
      const {
        answers,
        decodedId,
        // decodedRole
      } = req.body;

      // const answerIds = answers.map((e)=>e.answer);
      // const answerData = answers.map(e=>{
      //     const {answer,...rest} = e;
      //     return rest;
      // });

      const bulkOperation = answers.map((e) => {
        const { answer, ...rest } = element;
        return {
          updateOne: {
            filter: { answer },
            update: { $set: { ...rest } },
          },
        };
      });

      const result = await QuizAttempt.bulkWrite(bulkOperation);

      // const result = [];
      // for (let index = 0; index < answers.length; index++) {
      //     const element = answers[index];
      //     const {answer,...rest} = element;
      //     const data = await QuizAttempt.findByIdAndUpdate(
      //         answer,
      //         rest
      //     );
      //     result.push(data);
      // }

      return response.created(result);
    } catch (error) {
      return response.internalServerError();
    }
  }
}

module.exports = {
  QuizController,
};
