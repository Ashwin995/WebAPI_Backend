const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads');
    },
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        // callback(null, file.fieldname + '-' + Date.now() + '-' + ext);
        callback(null,file.originalname);
    }
});


const filterImage = (req, file, callback) => {
    const filter = file.originalname.match(/\.(jpg|jpeg|png|gif)$/);
    if (!filter) {
        callback(new Error("Please Upload Image"), false);
    }
    callback(null, true);
}

const upload = multer({storage: storage});

module.exports = upload;