import multer from "multer";
import { v4 as uuid } from "uuid";
// Storage Created
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "upload");
    },
    filename(req, file, callback) {
        const id = uuid();
        const extname = file.originalname.split(".").pop();
        const filename = `${id}.${extname}`;
        callback(null, filename);
    },
});
// Multer for Single File
const singleUpload = multer({ storage }).single("photo");
export { singleUpload };
