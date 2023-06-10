const ResponseWraper = require("../../helpers/response.helper");
const { Modules } = require("../../models/module");
const { Progress } = require("../../models/progress");
const { SubModule } = require("../../models/subModule");

class ModuleController {
    static async createModule(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedId, decodedRole, name, description, departmentId, thumbnail, tags, subModuleName, thumbnailUrl, subModuleDescription, videoUrl, duration, subModule } = req.body

            if (decodedRole === "company") {

                const module = await Modules.create({
                    name,
                    description,
                    tags,
                    thumbnail,
                    createdDate: new Date().toISOString(),
                    creator: decodedId,
                    department: departmentId,
                    totalSubModules: subModule.length
                })

                const subModuleResult = await SubModule.insertMany(subModule.map(e => ({
                    ...e, module: module._id,
                    createdDate: new Date().toISOString(),
                })))

                return response.created({ module, submodule: subModuleResult })


            } else {
                return response.badRequest("Only company can create the module.")
            }
        } catch (error) {
            console.log(error, "create module error");
            return response.internalServerError()
        }
    }

    static async editModule(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { moduleId, name, description, departmentId, thumbnail, tags } = req.body

            const data = await Modules.findByIdAndUpdate(moduleId, {
                name,
                description,
                department: departmentId,
                thumbnail,
                tags
            })

            return response.ok(data)
        } catch (error) {
            console.log(error, "edit module error");

            return response.internalServerError()
        }
    }

    static async deleteModule(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedRole, moduleId } = req.body

            if (decodedRole === "company") {
                const data = await Modules.findByIdAndDelete(moduleId)

                const subModuleData = await SubModule.deleteMany({ module: moduleId })

                return response.ok({ message: "Module deleted successfully" })
            } else {
                return response.badRequest("Only company can delete the module")
            }
        } catch (error) {
            console.log(error, "delete module error");
            return response.internalServerError()
        }
    }

    static async getModules(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedId,decodedRole,decodedDepartment } = req.body

            if(decodedRole === 'trainee'){
                const module = await Modules.find({ department: decodedDepartment }).populate('department')
                return response.ok(module)
            }else{
                const module = await Modules.find({ creator: decodedId }).populate('department')
                return response.ok(module)
            }
        } catch (error) {
            console.log(error, "get modules error");

            return response.internalServerError
        }
    }

    static createProgressOfTrainee = async(req,res)=>{
        const response = new ResponseWraper(res);
        try {
            const {moduleId} = req.query;
            const { decodedCreator, decodedId } = req.body;

            const submodules = await SubModule.find({module:moduleId}).sort(
                "sort"
            );

            if(submodules.length>0){

                const progressAlready = await Progress.findOne({
                    module:moduleId,
                    trainee: decodedId
                });

                console.log(progressAlready);

                if(progressAlready){
                    return response.ok(progressAlready);
                }

               console.log( decodedId,'vraj');
                
               const progress = await Progress.create({
                    module: moduleId,
                    company: decodedCreator,
                    submodule: submodules[0].sort,
                    total: submodules.length,
                    trainee: decodedId
                });
                return response.ok(progress);
            }else{
                return response.badRequest('No submodules');
            }

        } catch (error) {
            console.log(error);
            return response.internalServerError();
        }
    }

    static setProgessOfTrainee = async(req,res) => {
        const response = new ResponseWraper(res);
        try {
            const {progressId,submoduleId} = req.query; 
            // const {decodedId} = req.body;
                const submodule = await SubModule.findById(submoduleId);
                const progress = await Progress.findByIdAndUpdate(progressId,
                    {$set:{
                            submodule: submodule.sort
                        }});
            return response.ok(progress);
        } catch (error) {
            console.log(error);
            return response.internalServerError();
        }
    }
}

module.exports = { ModuleController }