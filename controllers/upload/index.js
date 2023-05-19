const { imagekit } = require("../../helpers/imagekitupload.helper");
const ResponseWraper = require("../../helpers/response.helper");

const uploadController = async(req, res) => {
    const response = new ResponseWraper(res);
    try {
        const file = req.file;
        console.log(file);
        const resp = await imagekit.upload({
            file: file?.buffer,
            fileName: file?.originalname,
        });
        return response.ok(resp);
    } catch (error) {
        console.log(error);
        return response.internalServerError();
    }
}

module.exports = {
    uploadController
}