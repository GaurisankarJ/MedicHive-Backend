// Express Web Application Framework
const express = require("express");
// HTTP2
const http2 = require("spdy");
// Path
const path = require("path");
// Cross-Origin Resource Sharing
const cors = require("cors");
// Request Body Parsing Middleware
const bodyParser = require("body-parser");
// HelmetJS Security
const helmet = require("helmet");
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
// Middleware
// ###################################################################
const { authenticate } = require("./middleware/authenticate.js");
const { isActive } = require("./middleware/isActive.js");
// ###################################################################
// Routes
// ###################################################################
// USER
const { postUserSignUp } = require("./routes/user/crud/postUser.js");
const { getUser } = require("./routes/user/crud/getUser.js");
const { deleteUser } = require("./routes/user/crud/deleteUser.js");
const { updateUser } = require("./routes/user/crud/patchUser.js");
const { userLogin } = require("./routes/user/login.js");
const { userLogout } = require("./routes/user/logout.js");
const { userActivateSend, userActivateMe } = require("./routes/user/activate.js");
const { userForgotSend, userForgotMe } = require("./routes/user/forgot.js");
// ###################################################################
// USER TYPE
const { postUserData } = require("./routes/userData/crud/postUserData.js");
const { getUserData } = require("./routes/userData/crud/getUserData.js");
const { deleteUserData } = require("./routes/userData/crud/deleteUserData.js");
const { updateUserData } = require("./routes/userData/crud/patchUserData.js");
const { getMessage } = require("./routes/userData/getMessage.js");
// ###################################################################
// RECORD
const { postRecord } = require("./routes/record/crud/postRecord.js");
const { getRecord } = require("./routes/record/crud/getRecord.js");
const { deleteRecord, deleteRecordById } = require("./routes/record/crud/deleteRecord.js");
const { updateRecord, updateRecordById } = require("./routes/record/crud/patchRecord.js");
// ###################################################################
// COMMUNICATION
const { buyerRequestRecord, sellerRequestRecord } = require("./routes/communication/request.js");
const { sellerShareRecord, verifierShareRecord } = require("./routes/communication/share.js");
const { sellerVerifyRecord, verifierGetRecord, verifierVerifyRecord } = require("./routes/communication/verify.js");
// ###################################################################
// + ADD FEATURE
// DOCUMENT
const { uploadDocument } = require("./routes/document_TODO/uploadDocument.js");
const { downloadDocument } = require("./routes/document_TODO/downloadDocument.js");
const { getDocuments } = require("./routes/document_TODO/getDocuments.js");
// ###################################################################

// Create Express app
const app = express();

// HTTP2 Certificate
const certificate = {
    key: fs.readFileSync(path.join(__dirname, "../cert/server.key")),
    cert: fs.readFileSync(path.join(__dirname, "../cert/server.crt")),
    ca: fs.readFileSync(path.join(__dirname, "../cert/server.csr"))
};
// Define port
const port = process.env.PORT;
// Define corsOptions
const corsOptions = {
    exposedHeaders: ["x-auth", "x-secret", "x-name", "x-type"]
};

// Use CORS
app.use(cors(corsOptions));
// Use helmetJS middleware
app.use(helmet({
    frameguard: { action: "deny" }
}));
// Use the body-parser middleware for JSON data
app.use(bodyParser.json());
// Use the body-parser middleware for URL encoded data
app.use(bodyParser.urlencoded({ extended: true }));
// Use the logger
app.use(logger("combined", {
    stream: fs.createWriteStream("./server/logs/server.log", { flags: "a" })
}));

app.get("/", (req, res) => res.send(`SERVER IS UP ON ${port}`));

// ###################################################################
// User Routes
app.post("/users", (req, res) => postUserSignUp(req, res));

app.get("/users", authenticate, (req, res) => getUser(req, res));

app.delete("/users", authenticate, (req, res) => deleteUser(req, res));

app.patch("/users", authenticate, (req, res) => updateUser(req, res));

app.post("/users/login", (req, res) => userLogin(req, res));

app.delete("/users/logout", authenticate, (req, res) => userLogout(req, res));

app.get("/users/activate", authenticate, (req, res) => userActivateSend(req, res));

app.post("/users/activate/:secret", (req, res) => userActivateMe(req, res));

app.get("/users/forgot", (req, res) => userForgotSend(req, res));

app.post("/users/forgot/:secret", (req, res) => userForgotMe(req, res));
// ###################################################################
// UserData Routes
app.post("/users/me", authenticate, (req, res) => postUserData(req, res));

app.get("/users/me", authenticate, (req, res) => getUserData(req, res));

app.delete("/users/me", authenticate, (req, res) => deleteUserData(req, res));

app.patch("/users/me", authenticate, (req, res) => updateUserData(req, res));

app.get("/message/me", authenticate, isActive, (req, res) => getMessage(req, res));
// ###################################################################
// Record Routes
app.post("/record", authenticate, (req, res) => postRecord(req, res));

app.get("/record", authenticate, (req, res) => getRecord(req, res));

app.delete("/record", authenticate, (req, res) => deleteRecord(req, res));

app.patch("/record", authenticate, (req, res) => updateRecord(req, res));

app.delete("/record/:id", authenticate, (req, res) => deleteRecordById(req, res));

app.patch("/record/:id", authenticate, (req, res) => updateRecordById(req, res));
// ###################################################################
// Communication Routes
// Buyer
app.post("/request/b", authenticate, isActive, (req, res) => buyerRequestRecord(req, res));

// Seller
app.post("/share/s", authenticate, isActive, (req, res) => sellerShareRecord(req, res));

app.post("/request/s", authenticate, isActive, (req, res) => sellerRequestRecord(req, res));

app.post("/verify/s", authenticate, isActive, (req, res) => sellerVerifyRecord(req, res));

// Verifier
app.post("/share/v", authenticate, isActive, (req, res) => verifierShareRecord(req, res));

app.get("/verify/v", authenticate, isActive, (req, res) => verifierGetRecord(req, res));

app.post("/verify/v", authenticate, isActive, (req, res) => verifierVerifyRecord(req, res));
// ###################################################################
// + ADD FEATURE
// Document Routes
app.post("/upload", authenticate, (req, res) => uploadDocument(req, res));

app.get("/downloads", authenticate, (req, res) => getDocuments(req, res));

app.get("/download/:id", authenticate, (req, res) => downloadDocument(req, res));
// ###################################################################


// Create HTTP2 server
let server;
// const server = http2.createServer(certificate, app);

// HTTP/1 HTTP/2
if (!server) {
    const listener = app.listen(port, () => {
        console.log(`(HTTP)Server running on port ${listener.address().port}!`);
    });
} else if (server) {
    const listener = server.listen(port, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        } else {
            console.log(`(HTTPS)Server running on port ${listener.address().port}!`);
        }
    });
}

// Export for testing
module.exports = { app };
