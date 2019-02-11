const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("./config/config.js");
require("./db/mongoose.js");
require("./routes/app-use.js");
const { authenticate } = require("./middleware/authenticate.js");
const { userSignUp } = require("./routes/user/signup.js");
const { userLogin } = require("./routes/user/login.js");
const { userLogout } = require("./routes/user/logout.js");
const { userSetMe } = require("./routes/user/setme.js");
const { userGetMe } = require("./routes/user/getme.js");
const { userPatchMe } = require("./routes/user/patchme.js");
const { postRecord } = require("./routes/record/record-post.js");
const { getRecord } = require("./routes/record/record-get.js");
const { patchRecord } = require("./routes/record/record-patch.js");
const { deleteRecord } = require("./routes/record/record-delete.js");
const { documentUpload } = require("./routes/document/documents-upload.js");
const { getDocuments } = require("./routes/document/documents-get.js");
const { documentDownload } = require("./routes/document/documents-download.js");

const app = express();
const port = process.env.PORT;

const corsOptions = {
    exposedHeaders: ["x-auth", "x-name", "x-type"]
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send(`SERVER IS UP ON ${port}`));

app.post("/users", (req, res) => userSignUp(req, res));

app.post("/users/login", (req, res) => userLogin(req, res));

app.delete("/users/me/token", authenticate, (req, res) => userLogout(req, res));

app.post("/users/me", authenticate, (req, res) => userSetMe(req, res));

app.get("/users/me", authenticate, (req, res) => userGetMe(req, res));

app.patch("/users/me", authenticate, (req, res) => userPatchMe(req, res));

app.post("/record", authenticate, (req, res) => postRecord(req, res));

app.get("/record", authenticate, (req, res) => getRecord(req, res));

app.patch("/record", authenticate, (req, res) => patchRecord(req, res));

app.delete("/record", authenticate, (req, res) => deleteRecord(req, res));

app.post("/upload", authenticate, (req, res) => documentUpload(req, res));

app.get("/downloads", authenticate, (req, res) => getDocuments(req, res));

app.get("/download/:id", authenticate, (req, res) => documentDownload(req, res));

const listener = app.listen(port, () => {
    console.log(`Server running on port ${listener.address().port}!`);
});

module.exports = { app };
