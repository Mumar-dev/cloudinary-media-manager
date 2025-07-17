const express = require("express")
const router = express.Router()

const { localfileUpload, ImageUpload, VideoUpload } = require("../controllers/uploadFileController")

router.post("/localUpload", localfileUpload);
router.post("/imageUpload", ImageUpload)
router.post("/vedioUpload", VideoUpload)
// router.post("/compressedImage", CompreesedImageUpload)



module.exports = router;