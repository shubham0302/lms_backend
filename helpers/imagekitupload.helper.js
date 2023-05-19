const ImageKit = require("imagekit");
const { IK_PUBLIC_KEY, IK_PRIVATE_KEY, IK_UPLOAD_URL } = require("../config/environment.config");
const imagekit = new ImageKit({
  publicKey: IK_PUBLIC_KEY,
  privateKey:IK_PRIVATE_KEY,
  urlEndpoint: IK_UPLOAD_URL,
});

module.exports = {
    imagekit
}