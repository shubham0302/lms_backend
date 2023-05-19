const ResponseWraper = require("../../helpers/response.helper");
const { Modules } = require("../../models/module");
const { SubModule } = require("../../models/subModule");

class SubModuleController {
    static async createSubModule(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedRole, moduleId, subModule } = req.body

            console.log(moduleId, "moduleId");

            if (decodedRole) {

                const module = await Modules.findById(moduleId)

                console.log(module, "module");

                if (module) {

                    const subModuleResult = await SubModule.insertMany(subModule.map(e => ({
                        ...e, module: moduleId,
                        createdDate: new Date().toISOString(),
                    })))

                    // const data = await SubModule.create({
                    //     subModuleName,
                    //     subModuleDescription,
                    //     videoUrl,
                    //     thumbnailUrl,
                    //     createdDate: new Date().toISOString(),
                    //     duration,
                    //     module: moduleId
                    // })

                    return response.created(subModuleResult)
                } else {
                    return response.badRequest("No module found with the given id.")
                }
            } else {
                return response.badRequest("Only company can create the sub module")
            }
        } catch (error) {
            console.log(error, "create sub module error");

            return response.internalServerError()
        }
    }

    static async editSubModule(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { subModuleId, subModuleName, subModuleDescription, videoUrl, duration, thumbnailUrl } = req.body

            const data = await SubModule.findByIdAndUpdate(subModuleId, {
                subModuleName,
                subModuleDescription,
                videoUrl,
                duration,
                thumbnailUrl
            })

            return response.ok(data)
        } catch (error) {
            console.log(error, "edit sub module error");
            return response.internalServerError()
        }
    }

    static async deleteSubModule(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedRole, subModuleId } = req.body

            if (decodedRole === "company") {
                const data = await SubModule.findByIdAndDelete(subModuleId)

                return response.ok({ message: "Sub module deleted successfully" })
            } else {
                return response.badRequest("Only company can delete sub module")
            }
        } catch (error) {

        }
    }

    static async getSubModules(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { moduleId } = req.query

            const module = await Modules.findById(moduleId).populate('department')

            if (module) {

                const subModule = await SubModule.find({ module: moduleId })

                return response.ok({ module, subModule })


            } else {
                return response.badRequest("No modules found with the given id.")
            }
        } catch (error) {
            console.log(error, "get sub modules error");

            return response.internalServerError()
        }
    }

    static async getSingleSubModule(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { subModuleId } = req.query
            const data = await SubModule.findById(subModuleId).populate('module')
            return response.ok(data)
        } catch (error) {

        }
    }
}

module.exports = { SubModuleController }