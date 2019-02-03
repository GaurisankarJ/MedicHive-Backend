// const fileUpload = require("express-fileupload");

// app.use(fileUpload());
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, __dirname + "/uploads");
//     },
//     filename: (req, file, callback) => {
//         callback(null, file.originalname + ",_" + req.user._id);
//     },
//     metadata: function (req, file, callback) {
//         callback(null, { originalname: file.originalname });
//     }
// });
// const storage = GridFSStorage({
//     gfs: gfs,
//     url: process.env.MONGODB_URI,
//     file: (req, file) => {
//         return {
//             filename: file.originalname,
//             metadata: req.user._id
//         };
//     }
// });
// const upload = multer({ storage: storage });
