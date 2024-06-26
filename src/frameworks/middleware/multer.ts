import multer from 'multer';
import path from 'path'

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));

    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        console.log('image uploaded')
        cb(null, name);
    }
})
const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/videos'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

export const uploadFile = multer({ storage: storage });
export const uploadVideo = multer({ storage:videoStorage });
