const ResponseWraper = require("../../helpers/response.helper");
const { Modules } = require("../../models/module");
const { QuizAttemptEvaluate, QuizForm } = require("../../models/quiz");
const { SubModule } = require("../../models/subModule");
const { User } = require("../../models/users");

class ReportController {
    static getReportCountByModule= async(req,res)=>{
        const response = new ResponseWraper(res);
        try {
            const {moduleID} = req.query;

            const moduleDetails = await Modules.findById(moduleID);

            console.log(moduleDetails);

            const totalStudents = await User.find({
                department: moduleDetails.department,
            })
            const lessions = await SubModule.find({module:moduleID});

            const submoduleID = lessions.map(e=>e._id);

            const forms = await QuizForm.find({
                submodule:{
                    $in: submoduleID
                }
            });

            console.log(forms);
            
            const traineeAppear = await QuizAttemptEvaluate.find({
                form: {
                    $in: forms.map(e=>e._id)
                }
            }).populate('trainee');
            console.log(traineeAppear);

            const traineePass = traineeAppear.reduce((a,b)=>{
                if(a.findIndex(e=>e.trainee_id === b.trainee._id) === -1){
                    const obj = {
                        trainee_id: b.trainee._id,
                        trainee_name: b.trainee.firstName +' '+b.trainee.lastName,
                        total_appear: traineeAppear.filter(e=>e.trainee._id === b.trainee._id).length,
                        pass: traineeAppear.filter(e=>e.trainee._id === b.trainee._id && e.pass).length,
                        fail: traineeAppear.filter(e=>e.trainee._id === b.trainee._id && !e.pass).length,
                        // obtain: 
                    }
                    return [...a,obj];
                }else{
                    return a;
                }
            },[]);

            const totalStudentPass  = traineePass.reduce((a,b)=>a+b.pass,0);
            const totalStudentFail  = traineePass.reduce((a,b)=>a+b.fail,0);

            return response.ok({
                totalStudents:totalStudents.length,
                lessions: lessions.length,
                traineePass,
                totalStudentPass,
                totalStudentFail
            });

        } catch (error) {
            console.log(error);
            return response.internalServerError();
        }
    }

    static getTraineeReport = async(req,res) =>{
        const response = new ResponseWraper(res);
        try {

            const {decodedDepartment} = req.body;

            const moduleList = await Modules.find({
                department:decodedDepartment
            });

            const moduleReport = [];

            for (let index = 0; index < moduleList.length; index++) {
                const element = moduleList[index];

                const submodule = await SubModule.find({module:element});

                const form = await QuizForm.find({
                    submodule: {
                        $in: submodule.map(e=>e._id)
                    }
                });

                const attempt = await QuizAttemptEvaluate.find({
                    form: {
                        $in: form.map(e=>e._id)
                    }
                })

                const data = {
                    moduleId: element._id,
                    moduleName: element.name,
                    totalMarks: form.reduce((a,b)=>a+b.total,0),
                    obtain: attempt.reduce((a,b)=>a+b.obtain,0),
                }

                moduleReport.push(data);
            }

            return response.ok(moduleReport);

        } catch (error) {
            console.log(error);
            return response.internalServerError();
        }
    }

}
module.exports = {
    ReportController
}