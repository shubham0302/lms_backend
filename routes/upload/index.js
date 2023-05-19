const { Router } = require("express");
const { uploadController } = require("../../controllers/upload");
const { uploadImage } = require("../../middlewares/upload.middleware");


const uploadRouter = Router();

uploadRouter.post('/image', uploadImage,uploadController);


module.exports = { uploadRouter }