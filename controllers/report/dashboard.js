const { Types } = require("mongoose");
const ResponseWraper = require("../../helpers/response.helper");
const { Certificate } = require("../../models/certificate");
const { Department } = require("../../models/department");
const { Modules } = require("../../models/module");
const { Progress } = require("../../models/progress");
const { QuizAttemptEvaluate, Quiz, QuizForm } = require("../../models/quiz");
const { SubModule } = require("../../models/subModule");
const { User } = require("../../models/users");


class DashboardController {

static getCompanyDashboardCount = async(req,res)=>{
    const resposne = new ResponseWraper(res);
    try {
        const {decodedId} = req.body;
        const departmentCount = await Department.count({
        company: decodedId
        });
        const modules = await Modules.find({
        creator: decodedId
        });
        const traineeCount = await User.count({
            role:'trainee',
        creator: decodedId
        });

        // const topPerformer = 

        //  await QuizAttemptEvaluate.aggregate([
        //     // company:decodedId,
            
        //         { $group: { _id: '$trainee', totalMarks: { $sum: '$marks' } } }, // Group by trainee and calculate total marks
        //         { $sort: { totalMarks: -1 } }, // Sort by total marks in descending order
        //         { $limit: 5 }, // Limit the result to top 5 performances
              
        //  ]).populate('trainee').populate({
        //     path : 'form',
        //     populate : {
        //       path : 'submodule'
        //     }
        //   })

        const tp = await QuizAttemptEvaluate.aggregate([
            {
              $group: {
                _id: '$trainee',
                form: {$last: '$form'},
                totalMarks: { $max: '$obtain' },
              },
            },
            { $sort: { totalMarks: -1 } },
            { $limit: 5 },
          ]);

          const topPerformer = await Promise.all(
            tp.map(async (result) => {
                const trainee = await User.findById(result._id).lean();
                const moduleD = await QuizForm.findById(result.form).populate('submodule');
        
                console.log(result);
                console.log(trainee);

                return {
                  _id: result._id,
                  totalObtainedMarks: result.totalMarks,
                  totalMarks: moduleD.total,
                  trainee: {
                    _id: trainee._id,
                    name: trainee.firstName +' '+trainee.lastName,
                    company: trainee.creator
                  },
                  module: {
                    _id: moduleD.submodule._id,
                    name: moduleD.submodule.subModuleName,
                  },
                };
              })
          );

          console.log(topPerformer,decodedId);

        return resposne.ok({
            departmentCount,
            modules,
            traineeCount,
            moduleCount: modules.length,
            topPerformer: topPerformer.filter(e=>e.trainee.company.toString() === decodedId)
        });

    } catch (error) {
      console.log(error);
        return resposne.internalServerError();
    }
}

static getTraineeDashboardCount = async(req,res)=>{
    const resposne = new ResponseWraper(res);
    try {
      
      const {
        decodedId,
        decodedDepartment
      } = req.body;

      console.log(decodedDepartment);

      const modules = await Modules.find({
        department:decodedDepartment
      }).sort({
        createdAt: -1
      });


      const certificates = await Certificate.find({
        module:{
          $in: modules.map(e=>e._id)
        }
      }).populate('module');

      const progress = await Progress.find({
        module: {
          $in: modules.map(e=>e._id)
        }
      }).populate('module')


      const submodules = await SubModule.find({
        module: {
          $in: modules.map(e=>e._id)
        }
      }); 

      const forms = await QuizForm.find({
        submodule: {
          $in: submodules.map(e=>e._id)
        }
      });

      const attempts = await QuizAttemptEvaluate.find({
        form: {
          $in: forms.map(e=>e._id),
        }
      }).populate('form');


      const upcomingTest = forms.filter(e=> 
        {
         return attempts.findIndex(el=> el.form._id.toString() === e._id.toString()) === -1
        }
        );


      return resposne.ok({
        totalModules: modules.length,
        completedCourse: certificates.length,
        certificatesEarned: certificates.filter(e=>e.pass).length,
        newModule: modules.slice(0,5),
        progress,
        attempts,
        upcomingTest
      })

    } catch (error) {
      console.log(error);
        return resposne.internalServerError();
    }
}

}

module.exports ={
    DashboardController
}