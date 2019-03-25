// Express Web Application Framework
const express = require("express");
// Cross-Origin Resource Sharing
const cors = require("cors");
// HelmetJS Security
const helmet = require("helmet");
// Request Body Parsing Middleware
const bodyParser = require("body-parser");
// File System
const fs = require("fs");
// Morgan Logger
const logger = require("morgan");

// Environment Configuration
require("./config/config.js");
// MongoDB Configuration
require("./db/mongoose.js");
// require("./routes/app-use.js");

// ###################################################################
// Routes
// ###################################################################
// USER
const { postUserSignup } = require("./routes/user/crud/postUser.js");
const { deleteUser } = require("./routes/user/crud/deleteUser.js");
const { patchUser } = require("./routes/user/crud/patchUser.js");
const { authenticate } = require("./middleware/authenticate.js");
const { userLogin } = require("./routes/user/login.js");
const { userLogout } = require("./routes/user/logout.js");
const { userConfirm } = require("./routes/user/confirm.js");
const { userForgotMe, userForgotReset } = require("./routes/user/forgot");
// ###################################################################
// USER TYPE
const { postUserDetail } = require("./routes/userDetail/crud/postUserDetail.js");
const { getUserDetail } = require("./routes/userDetail/crud/getUserDetail.js");
const { deleteUserDetail } = require("./routes/userDetail/crud/deleteUserDetail.js");
const { patchUserDetail } = require("./routes/userDetail/crud/patchUserDetail.js");
// ###################################################################
// RECORD
const { postRecord } = require("./routes/record/crud/postRecord.js");
const { getRecord } = require("./routes/record/crud/getRecord.js");
const { deleteRecord, deleteRecordById } = require("./routes/record/crud/deleteRecord.js");
const { patchRecord, patchRecordById } = require("./routes/record/crud/patchRecord.js");
// ###################################################################
// DOCUMENT
const { documentUpload } = require("./routes/document/documents-upload.js");
const { getDocuments } = require("./routes/document/documents-get.js");
const { documentDownload } = require("./routes/document/documents-download.js");
// ###################################################################

const app = express();
const port = process.env.PORT;

// Setting permission for cross origin requests
const corsOptions = {
    exposedHeaders: ["x-auth", "x-name", "x-type"]
};
app.use(cors(corsOptions));
// Using helmetJS middleware
app.use(helmet({
    frameguard: { action: "deny" }
}));
// Using the body-parser middleware for JSON data
app.use(bodyParser.json());
// Using the body-parser middleware for URL encoded data
app.use(bodyParser.urlencoded({ extended: true }));
// Using the logger
app.use(logger("combined", {
    stream: fs.createWriteStream("./server/logs/server.log", { flags: "a" })
}));

app.get("/", (req, res) => res.send(`SERVER IS UP ON ${port}`));

// ###################################################################
// User Routes
app.post("/users", (req, res) => postUserSignup(req, res));

app.delete("/users", authenticate, (req, res) => deleteUser(req, res));

app.patch("/users", authenticate, (req, res) => patchUser(req, res));

app.post("/users/login", (req, res) => userLogin(req, res));

app.delete("/users/logout", authenticate, (req, res) => userLogout(req, res));

app.get("/users/confirm", (req, res) => userConfirm(req, res));

app.get("/users/forgot", (req, res) => userForgotMe(req, res));

app.post("/users/forgot", (req, res) => userForgotReset(req, res));
// ###################################################################
// UserDetails Routes
app.post("/users/me", authenticate, (req, res) => postUserDetail(req, res));

app.get("/users/me", authenticate, (req, res) => getUserDetail(req, res));

app.delete("/users/me", authenticate, (req, res) => deleteUserDetail(req, res));

app.patch("/users/me", authenticate, (req, res) => patchUserDetail(req, res));
// ###################################################################
// Record Routes
app.post("/record", authenticate, (req, res) => postRecord(req, res));

app.get("/record", authenticate, (req, res) => getRecord(req, res));

app.delete("/record", authenticate, (req, res) => deleteRecord(req, res));

app.patch("/record", authenticate, (req, res) => patchRecord(req, res));

app.delete("/record/:id", authenticate, (req, res) => deleteRecordById(req, res));

app.patch("/record/:id", authenticate, (req, res) => patchRecordById(req, res));
// ###################################################################
// Document Routes
app.post("/upload", authenticate, (req, res) => documentUpload(req, res));

app.get("/downloads", authenticate, (req, res) => getDocuments(req, res));

app.get("/download/:id", authenticate, (req, res) => documentDownload(req, res));
// ###################################################################

const listener = app.listen(port, () => {
    console.log(`Server running on port ${listener.address().port}!`);
});

// Export for testing
module.exports = { app };
