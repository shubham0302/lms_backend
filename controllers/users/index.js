const { SALT_SECRET } = require("../../config/environment.config");
const ResponseWraper = require("../../helpers/response.helper");
const { User } = require("../../models/users");
const bcrypt = require("bcrypt")

class UserController {
    static async register(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { firstName, lastName, email, password, phoneNumber, role, department, decodedRole, decodedId, address, profile } = req.body

            const isEmailExists = await User.find({ email })

            // console.log(decodedId, "decodedId");

            if (isEmailExists.length > 0) {
                return response.badRequest("Email already exists")
            }

            const isPhoneNumberExists = await User.find({ phoneNumber })

            if (isPhoneNumberExists.length > 0) {
                return response.badRequest("Phone number already exists")
            }

            if (decodedRole === "admin" && (role === "trainee" || role === "admin")) {
                return response.badRequest(`Admin can't create the ${role}`)
            }

            if (decodedRole === "company" && (role === "admin" || role === "company")) {
                return response.badRequest(`Company can't create the ${role}`)
            }

            const user = await User.create({
                firstName,
                lastName,
                email,
                password, address, profile,
                phoneNumber,
                role,
                department,
                creator: decodedId
            })

            return response.created({ accessToken: user.generateToken(), user })


        } catch (error) {
            console.log(error);
            return response.internalServerError()
        }
    }

    static async login(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })

            if (user) {
                const authenticate = await user.authenticate(password)

                if (!authenticate) {
                    return response.badRequest("Password is invalid")
                }

                return response.created({ accessToken: user.generateToken(), user })

            } else {
                return response.badRequest("No user found with the given email.")
            }

        } catch (error) {
            console.log(error);

            return response.internalServerError()
        }
    }

    static async changePassword(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedId, oldPassword, newPassword } = req.body


            const user = await User.findById(decodedId)

            if (user) {

                const authenticatedUser = await user.authenticate(oldPassword)

                if (authenticatedUser) {

                    if (oldPassword !== newPassword) {

                        const pass = await bcrypt.hash(newPassword, bcrypt.genSaltSync(Number(SALT_SECRET)))

                        await User.findByIdAndUpdate(decodedId, {
                            password: pass
                        })

                    } else {
                        return response.badRequest("Old password and New password cannot be same.")
                    }
                } else {
                    return response.badRequest("Old password is not correct")
                }

            } else {
                return response.badRequest("No user found")
            }

            await user.save()

            return response.ok(user)

        } catch (error) {
            console.log(error);
            return response.internalServerError()
        }

    }

    static async forgotPassword(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { email } = req.body

            const user = await User.findOne({ email })

            if (user) {
                const tomorrowDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString();
                const otp = '123123'
                await user.updateOne({
                    otp,
                    expireOtp: tomorrowDate
                })


            } else {
                return response.badRequest("No user found")
            }

            await user.save()
            return response.ok(user)
        } catch (error) {
            console.log(error);
            return response.internalServerError()
        }
    }

    static async verifyOtp(req, res) {
        const response = new ResponseWraper(res)

        try {

            const { email, otp } = req.body
            const user = await User.findOne({ email })

            if (user) {

                const today = new Date().toISOString()

                if (user.expireOtp < today) {
                    return response.badRequest("OTP is expired")
                } else {
                    if (user.otp === otp) {
                        await user.updateOne({
                            otp: '',
                            expireOtp: ''
                        })
                    } else {
                        return response.badRequest("OTP does not match")
                    }
                }

            } else {
                return response.badRequest("No user found")
            }

            await user.save()

            return response.ok({ userId: user._id })

        } catch (error) {
            console.log(error);
            return response.internalServerError()
        }
    }

    static async setNewPassword(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { userId, password } = req.body

            const user = await User.findById(userId)

            if (user) {

                const pass = await bcrypt.hash(password, bcrypt.genSaltSync(Number(SALT_SECRET)))
                await user.updateOne({
                    password: pass
                })

            } else {
                return response.badRequest("No user found")
            }

            await user.save()

            return response.ok({ message: "New Password is setted successfully" })

        } catch (error) {
            console.log(error);

            return response.internalServerError()
        }
    }

    static async getUsers(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedId } = req.body

            const data = await User.find({ creator: decodedId }).populate("department")
            return response.ok(data)


        } catch (error) {
            return response.internalServerError()
        }
    }

    static async deleteUser(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedRole } = req.body
            const { userId } = req.query

            if (decodedRole === "company") {

                const data = await User.findByIdAndDelete(userId)

                return response.ok("User deleted successfully.")
            } else {
                return response.badRequest("Only company can delete the user.")
            }



        } catch (error) {
            console.log(error, "delete user error");

            response.internalServerError()
        }
    }

    static async myProfile(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedId } = req.body

            const data = await User.findById(decodedId)

            return response.ok(data)

        } catch (error) {
            console.log(error, "my profile error");

            return response.internalServerError()
        }
    }

    static async editProfile(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedId, firstName, lastName, email, phoneNumber, address, profile } = req.body

            const data = await User.findByIdAndUpdate(decodedId, {
                firstName,
                lastName,
                address,
                phoneNumber,
                profile,
                email,
            })

            return response.ok(data)
        } catch (error) {
            console.log(error, "edit profile error");
            return response.internalServerError()
        }
    }

    static async editTrainee(req, res) {
        const response = new ResponseWraper(res)

        try {
            const { decodedRole, _id, firstName, lastName, email, phoneNumber, password, department, address, profile } = req.body

            if (decodedRole === "company") {
                const data = await User.findByIdAndUpdate(_id, {
                    firstName, lastName, email, phoneNumber, password, department, address, profile
                })

                return response.ok(data)
            } else {
                return response.badRequest("Only company can edit the trainee")
            }
        } catch (error) {
            console.log(error, "edit trainee error");
            return response.internalServerError()
        }
    }

}

module.exports = { UserController }