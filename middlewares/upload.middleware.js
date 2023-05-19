const multer = require("multer");
const ResponseWraper = require("../helpers/response.helper");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImage = (req, res, next) => {
    const response = new ResponseWraper(res);
    try {
        
        upload
        .single('img')
        (req, res, (err) => {
            console.log('error here', err);
            if (err) {
                return response.internalServerError()
            };
            console.log('userfile', req?.file);
            req.body = { ...req.body, img: req?.file }
            return next();
        });
    } catch (error) {
        return response.internalServerError();
    }
  }

  module.exports = {
    uploadImage
  }