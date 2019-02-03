const multer = require("multer");
const GridFSStorage = require("multer-gridfs-storage");

const { gfs } = require("../../db/mongoose.js");

const storage = GridFSStorage({
    gfs: gfs,
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return {
            filename: file.originalname,
            metadata: req.user._id
        };
    }
});
const upload = multer({ storage: storage }).single("file");

const documentUpload = (req, res) => { // [authenticate, upload.single("file")]
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.send({
            name: req.file.originalname
        });
    });
};

module.exports = { documentUpload };