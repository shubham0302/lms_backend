const { default: mongoose } = require("mongoose");
const ResponseWraper = require("../../helpers/response.helper");
const { Quiz, QuizForm, QuizAttempt, QuizAttemptEvaluate } = require("../../models/quiz");
const { SubModule } = require("../../models/subModule");
const { Certificate } = require("../../models/certificate");
const { Progress } = require("../../models/progress");

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
        total: quizForm.reduce((a,b)=>
        a+b.weightage
        ,0)
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
      const { submodule } = req.query;
      const { decodedId } = req.body;
      const formDetails = await QuizForm.findOne({submodule});
      const quiz = await Quiz.find({
        form: formDetails._id,
      });

      const attempt = await QuizAttemptEvaluate.find({
        form: formDetails._id,
        trainee: decodedId
      })

      return response.ok({
        formDetails,
        quiz:attempt.length>0?[]:quiz,
      });
    } catch (error) {
      console.log(error);
      return response.internalServerError();
    }
  }

  static async getQuizList(req,res){
    const response = new ResponseWraper(res);
    try {
      const {submodule} = req.query;
      const formDetails = await QuizForm.findOne({
        submodule,
      });
      if(formDetails){
        return response.ok(formDetails);
      }else{
        return response.notFound('No Form found')
      }
    } catch (error) {
      console.log(error);
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

      if(!formDetails){
        return response.badRequest('No quiz');
      }

      console.log(formDetails,submodule);

      const attempts = await QuizAttemptEvaluate.find({
        form: formDetails._id,
      }).populate("trainee");

      // const resp = [];

      // for (let index = 0; index < attempts.length; index++) {
      //   const element = attempts[index];
      //   if (resp.findIndex((el) => el._id === element._id) === -1) {
      //     resp.push(element.trainee);
      //   }
      // }

      // const resp = attempts.reduce((a,b)=>{

      // },);

      return response.ok({attempts,isQuiz:true});
    } catch (error) {
      console.log(error);
      return response.internalServerError();
    }
  }

  static async getAppear(req, res) {
    const response = new ResponseWraper(res);
    try {
      const { form, trainee } = req.query;
      const formDetails = await QuizForm.findById(form);
      const formDetailsMarks = await QuizAttemptEvaluate.findOne({
        form,
        trainee
      }).populate(['form','trainee']);

      // const questions = await Quiz.find({
      //   form: form,
      // });
      const attempts = await QuizAttempt.find({
        form: form,
        trainee,
      }).populate('question');

      // console.log(questions);
      console.log(attempts);

      // if (questions.length !== attempts.length) {
      //   return response.badRequest("Question does not match appear");
      // }

      // const resp = questions.map((e) => ({
      //   ...e,
      //   answerId: attempts.find((el) => el.question === e._id)._id,
      //   answer: attempts.find((el) => el.question === e._id).answer,
      //   remarks: attempts.find((el) => el.question === e._id).remarks,
      //   evaluate: attempts.find((el) => el.question === e._id).evaluate,
      // }));

      return response.ok({
        formDetails: formDetailsMarks,
        formFields: attempts,
      });
    } catch (error) {
      console.log(error);
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
        // company
        decodedCreator
      } = req.body;
      const company = decodedCreator;


      const formDetails = await QuizForm.findById(quizForm);


      const answerSchema = answers.map((e) => ({
        ...e,
        form: quizForm,
        trainee: decodedId,
      }));

      const totalObtain = answers.reduce((a,b)=>
      a+b.evaluate
      ,0);



      const result = await QuizAttempt.create(answerSchema);

      const percentage = (totalObtain / formDetails.total) * 100

      let pass = false

      if(formDetails.cutoffispercent){
        pass = percentage >= formDetails.cutoff;
      }else{
        pass = totalObtain >= formDetails.cutoff;
      }


      await QuizAttemptEvaluate.create({
        company,
        form: quizForm,
        obtain: totalObtain,
        pass: pass,
        total: formDetails.total,
        trainee: decodedId,
      });

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
        const { answer, ...rest } = e;
        return {
          updateOne: {
            filter: { _id: answer },
            update: { $set: { ...rest } },
          },
        };
      });


      const totalObtain = answers.reduce(
        (a,b)=>a+b.evaluate,
        0
      );


      const ids = answers.map(e=>new mongoose.Types.ObjectId(e.answer));

      
      
      const result = await QuizAttempt.bulkWrite(bulkOperation);
      
      const resultData = await QuizAttempt.find({
        _id:{
          $in: ids
        }
      })

      bulkOperation.forEach((e)=>console.log(e.updateOne.update));
      // console.log(bulkOperation);

      const formDetails = await QuizForm.findById(resultData[0].form);
      
      let pass = false;
      
      const percentage = (totalObtain / formDetails.total) * 100;
      
      if(formDetails.cutoffispercent){
        pass = percentage >= formDetails.cutoff
      }else{
        pass = totalObtain >= formDetails.cutoff
      }
      console.log(totalObtain,pass, percentage);

      

      await QuizAttemptEvaluate.findOneAndUpdate({
        form: resultData[0].form,
        trainee: resultData[0].trainee,
      },{
        $set:{
          obtain: totalObtain,
          pass
        }
      });
      // const resultData = [];
      // for (let index = 0; index < answers.length; index++) {
      //     const element = answers[index];
      //     const {answer,...rest} = element;
      //     const data = await QuizAttempt.findByIdAndUpdate(
      //         answer,
      //         rest
      //     );
      //     resultData.push(data);
      // }



      return response.created(resultData);
    } catch (error) {
      console.log(error);
      return response.internalServerError();
    }
  }

  static getCertificate = async(req,res) => {
    const response = new ResponseWraper(res);
    try {
      const {moduleId}= req.query;
      const {decodedId, decodedCreator}= req.body;
      console.log(moduleId);
      const certificate = await Certificate.findOne({
        module:moduleId,
        trainee:decodedId
      }).populate('module').populate('trainee').populate('company');

      console.log(certificate);
      if(certificate){
        return response.ok(certificate);
      }else{

        const submodules = await SubModule.find({
          module:moduleId
        });

        const forms = await QuizForm.find({
          submodule:{
            $in:submodules.map(e=>e._id)
          }
        });

        const formsEvaluate = await QuizAttemptEvaluate.find({
          form:{
            $in:forms.map(e=>e._id)
          },
          trainee:decodedId
        });

        const certificateCreate = await Certificate.create({
          module:moduleId,
          company: decodedCreator,
          obtain: formsEvaluate.reduce((a,b)=>a+b.obtain,0),
          total: forms.reduce((a,b)=>a+b.total,0),
          pass: formsEvaluate.reduce((a,b)=>!a.pass?a+1:a,0)===0,
          totalPassQuiz: formsEvaluate.filter((a)=>a.pass).length,
          totalQuiz:forms.length,
          trainee:decodedId,
        });

        

        const cert = await Certificate.findById(certificateCreate._id).populate('module').populate('trainee').populate('company');

        return response.ok(cert);
      }
      
    } catch (error) {
      console.log(error);
      return response.internalServerError();
    }
  }

  static getProgress = async(req,res)=>{
    const response = new ResponseWraper(res);
    try {
      const {module} = req.query;
      const data = await Progress.find({module}).populate('trainee');
      console.log(data);
      return response.ok(data);
    } catch (error) {
      console.log(error);
      return response.internalServerError();
    }
  }


  static updateCertificate = async(req,res) => {
    const response = new ResponseWraper(res);
    try {
      const {module,trainee}= req.query;
      const {decodedId}= req.body;
      const certificate = await Certificate.findOne({
        module,
        trainee
      }).populate('module').populate('trainee');

      if(certificate){
        // return response.badRequest('No certifcate');
        const submodules = await SubModule.find({
          module
        });

        const forms = await QuizForm.find({
          submodule:{
            $in:submodules.map(e=>e._id)
          }
        });

        const formsEvaluate = await QuizAttemptEvaluate.find({
          form:{
            $in:forms.map(e=>e._id)
          },
          trainee:certificate.trainee._id
        });

        console.log(formsEvaluate.reduce((a,b)=>!b.pass?a+1:a,0)===0,'vraj');

        const certificateCreate = await Certificate.findByIdAndUpdate(certificate._id,{
          // module,
          // company: decodedCreator,
          obtain: formsEvaluate.reduce((a,b)=>a+b.obtain,0),
          total: forms.reduce((a,b)=>a+b.total,0),
          pass: formsEvaluate.reduce((a,b)=>!b.pass?a+1:a,0)===0,
          totalPassQuiz: formsEvaluate.filter((a)=>a.pass).length,
          totalQuiz:forms.length,
          // trainee:decodedId,
        }).populate('module').populate('trainee').populate('company');

        return response.ok(certificateCreate);
      }else{

        const submodules = await SubModule.find({
          module
        });

        const forms = await QuizForm.find({
          submodule:{
            $in:submodules.map(e=>e._id)
          }
        });

        const formsEvaluate = await QuizAttemptEvaluate.find({
          form:{
            $in:forms.map(e=>e._id)
          },
          trainee:trainee
        });

        const certificateCreate = await Certificate.create({
          module,
          company: decodedId,
          obtain: formsEvaluate.reduce((a,b)=>a+b.obtain,0),
          total: forms.reduce((a,b)=>a+b.total,0),
          pass: formsEvaluate.reduce((a,b)=>!a.pass?a+1:a,0)===0,
          totalPassQuiz: formsEvaluate.filter((a)=>a.pass).length,
          totalQuiz:forms.length,
          trainee:trainee,
        });

        const cert = await Certificate.findById(certificateCreate._id).populate('module').populate('trainee').populate('company');

        return response.ok(cert);
      }
    } catch (error) {
      console.log(error);
      return response.internalServerError();
    }
  }

}

module.exports = {
  QuizController,
};
