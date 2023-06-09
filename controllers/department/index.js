const ResponseWraper = require("../../helpers/response.helper")
const { Department } = require("../../models/department")

class DepartmentController {
    static async createDepartment(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedRole, decodedId, name, staff } = req.body

            if (decodedRole === "company") {

                if (name) {
                    const data = await Department.create({
                        name,
                        company: decodedId,
                        totalModules: 0,
                        totalTrainees: 0
                    })

                    return response.ok(data)
                } else {
                    return response.badRequest("Department already exist with this name.")
                }
            } else {
                return response.badRequest("Only company can create new department")
            }
        } catch (error) {
            console.log(error, "create department error");
            return response.internalServerError()
        }
    }

    static async getDepartmentList(req, res) {
        const response = new ResponseWraper(res)
        try {
            const { decodedId } = req.body

            const data = await Department.find({ company: decodedId })
            return response.ok(data)
        } catch (error) {
            console.log(error, "get department list error");
            return response.internalServerError()
        }

    }

    static async deleteDepartment(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedRole } = req.body
            const { departmentId } = req.query

            if (decodedRole === "company") {

                const data = await Department.findByIdAndDelete(departmentId)

                return response.ok({ message: "Department deleted successfully" })
            } else {
                return response.badRequest('Only company can delete the department')
            }

        } catch (error) {
            console.log(error, "delete department error");
            return response.internalServerError()
        }
    }

    static async editDepartment(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedRole, departmentId, name } = req.body

            if (decodedRole === "company") {

                const data = await Department.findByIdAndUpdate(departmentId, {
                    name
                })

                return response.ok(data)
            } else {
                return response.badRequest('Only company can edit the department')
            }

        } catch (error) {
            console.log(error, "delete department error");
            return response.internalServerError()
        }
    }

}

module.exports = { DepartmentController }