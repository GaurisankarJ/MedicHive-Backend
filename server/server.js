const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("./config/config.js");
require("./db/mongoose.js");
require("./routes/app-use.js");
// const { Document } = require("./models/document.js");
const { authenticate } = require("./middleware/authenticate.js");
const { userSignUp } = require("./routes/user/signup.js");
const { userLogin } = require("./routes/user/login.js");
const { userLogout } = require("./routes/user/logout.js");
const { userGetMe } = require("./routes/user/getme.js");
const { postRecords } = require("./routes/record/records-post.js");
const { getRecords } = require("./routes/record/records-get.js");
const { deleteRecords } = require("./routes/record/records-delete.js");
const { patchRecords } = require("./routes/record/records-patch.js");
const { documentUpload } = require("./routes/document/documents-upload.js");
const { getDocuments } = require("./routes/document/documents-get.js");
const { documentDownload } = require("./routes/document/documents-download.js");

const app = express();
const port = process.env.PORT;

const corsOptions = {
    exposedHeaders: ["x-auth", "x-name"]
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/users", (req, res) => userSignUp(req, res));

app.post("/users/login", (req, res) => userLogin(req, res));

app.delete("/users/me/token", authenticate, (req, res) => userLogout(req, res));

app.get("/users/me", authenticate, (req, res) => userGetMe(req, res));

app.post("/records", authenticate, (req, res) => postRecords(req, res));

app.get("/records", authenticate, (req, res) => getRecords(req, res));

app.delete("/records/:id", authenticate, (req, res) => deleteRecords(req, res));
    
app.patch("/records/:id", authenticate, (req, res) => patchRecords(req, res));

app.post("/upload", authenticate, (req, res) => documentUpload(req, res));

app.get("/downloads", authenticate, (req, res) => getDocuments(req, res));

app.get("/download/:id", authenticate, (req, res) => documentDownload(req, res));

var listener = app.listen(port, () => {
    console.log(`Server running on port ${listener.address().port}!`);
});

module.exports = { app };
