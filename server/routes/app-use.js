// FILEUPLOAD
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


// SENDGRID

// SendGridMail
// const sgMail = require("@sendgrid/mail");

// const SENDGRID_API_KEY = "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";

// Set API key
// sgMail.setApiKey(SENDGRID_API_KEY);

// const sendConfirmationMail = (email, secret) => {
//     // Set Email
//     const message = {
//         to: email,
//         from: "no-reply@myentity.co",
//         subject: "USER CONFIRMATION",
//         html: `<strong><a href="http://www.localhost:3000/confirm?secret=${secret}">CLICK TO CONFIRM</a></strong>`
//     };

//     // Send Email
//     sgMail.send(message);
// };
