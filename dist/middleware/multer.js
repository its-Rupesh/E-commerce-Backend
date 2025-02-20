import multer from "multer";
// Storage Created
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "upload");
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    },
});
// Multer for Single File
const singleUpload = multer({ storage }).single("photo");
export { singleUpload };
