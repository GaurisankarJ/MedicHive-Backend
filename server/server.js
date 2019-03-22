// Express Web Application Framework
const express = require("express");
// Request Body Parsing Middleware
const bodyParser = require("body-parser");
// Cross-Origin Resource Sharing
const cors = require("cors");
// File System
const fs = require("fs");
// Morgan Logger
const logger = require("morgan");

// Configuration Files
require("./config/config.js");
// MongoDB Configuration
require("./db/mongoose.js");
// require("./routes/app-use.js");

// ###################################################################
// Routes
// ###################################################################
// USER
const { authenticate } = require("./middleware/authenticate.js");
const { userSignUp } = require("./routes/user/signup.js");
const { userConfirm } = require("./routes/user/confirm.js");
const { userForgotMe } = require("./routes/user/forgot-get");
const { userForgotReset } = require("./routes/user/forgot-post");
const { userLogin } = require("./routes/user/login.js");
const { userLogout } = require("./routes/user/logout.js");
const { userDelete } = require("./routes/user/delete.js");
const { userPatch } = require("./routes/user/patch.js");
// ###################################################################
// USER TYPE
const { userSetMe } = require("./routes/user/types/setme.js");
const { userGetMe } = require("./routes/user/types/getme.js");
const { userDeleteMe } = require("./routes/user/types/deleteme.js");
const { userPatchMe } = require("./routes/user/types/patchme.js");
// ###################################################################
// RECORD
const { postRecord } = require("./routes/record/record-post.js");
const { getRecord } = require("./routes/record/record-get.js");
const { patchRecord } = require("./routes/record/record-patch.js");
const { deleteRecord } = require("./routes/record/record-delete.js");
const { patchRecordById } = require("./routes/record/record-patch.js");
const { deleteRecordById } = require("./routes/record/record-delete.js");
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
app.post("/users", (req, res) => userSignUp(req, res));

app.get("/confirm", (req, res) => userConfirm(req, res));

app.get("/forgot", (req, res) => userForgotMe(req, res));

app.post("/forgot", (req, res) => userForgotReset(req, res));

app.post("/users/login", (req, res) => userLogin(req, res));

app.delete("/users/logout", authenticate, (req, res) => userLogout(req, res));

app.delete("/users", authenticate, (req, res) => userDelete(req, res));

app.patch("/users", authenticate, (req, res) => userPatch(req, res));
// ###################################################################
// UserDetails Routes
app.post("/users/me", authenticate, (req, res) => userSetMe(req, res));

app.get("/users/me", authenticate, (req, res) => userGetMe(req, res));

app.delete("/users/me", authenticate, (req, res) => userDeleteMe(req, res));

app.patch("/users/me", authenticate, (req, res) => userPatchMe(req, res));
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
