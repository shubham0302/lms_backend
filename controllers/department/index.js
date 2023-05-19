const ResponseWraper = require("../../helpers/response.helper")
const { Department } = require("../../models/department")

class DepartmentController {
    static async createDepartment(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedRole, name, staff } = req.body

            if (decodedRole === "admin") {

                if (name) {
                    const data = await Department.create({
                        name
                    })

                    return response.ok(data)
                } else {
                    return response.badRequest("Department already exist with this name.")
                }
            } else {
                return response.badRequest("Only admin can create new department")
            }
        } catch (error) {
            console.log(error, "create department error");
            return response.internalServerError()
        }
    }
}

module.exports = { DepartmentController }