const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const cors = require("cors");
const multer = require("multer");
const GridFSStorage = require("multer-gridfs-storage");
const mongo = require("mongodb");
const GridFS = require("gridfs-stream");

require("./config/config.js");
require("./db/mongoose.js");
require("./routes/app-use.js");
// const { Document } = require("./models/document.js");
const { authenticate } = require("./middleware/authenticate.js");
const { userSignUp } = require("./routes/signup.js");
const { userLogin } = require("./routes/login.js");
const { userLogout } = require("./routes/logout.js");
const { userGetMe } = require("./routes/getme.js");
const { postRecords } = require("./routes/records-post.js");
const { getRecords } = require("./routes/records-get.js");
const { deleteRecords } = require("./routes/records-delete.js");
const { patchRecords } = require("./routes/records-patch.js");
const { documentUpload } = require("./routes/documents-upload.js");
const { documentDownload } = require("./routes/documents-download.js");
const { getDocuments } = require("./routes/documents-get.js");

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

mongo.MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
    if(err) {
        console.log("Unable to connect to MongoDB server!", err);
    }
    console.log("Connected to MongoDB server!");
    db = client.db("heroku_5jlwn49z");

    const gfs = new GridFS(db, mongo);
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
    const upload = multer({ storage: storage });

    app.post("/upload", [authenticate, upload.single("file")], (req, res) => {
        res.send({
            name: req.file.originalname
        });
    });

    app.get("/downloads", authenticate, (req, res) => {
        gfs.files.find({ metadata: req.user._id }).toArray(function (err, files) {
            if (err) {
                console.log(err);
                res.status(404).send(err);
            }
            var docs = files.map((file) => {
                return {
                    _id: file._id,
                    name: file.filename,
                    date: file.uploadDate
                };
            });
            res.send({ docs });
        });
    });

    app.get("/download/:id", authenticate, (req, res) => {
        var id = req.params.id;
        var creator = req.user._id;

        gfs.files.find({ _id: new mongo.ObjectID(id), metadata: new mongo.ObjectID(creator) }).toArray(function (err, files) {
            if (err) {
                console.log(err);
                res.status(404).send(err);
            }
            //TEST WRITE STREAM
            // const testWriteStream = fs.createWriteStream("file.jpg");
            const readStream = gfs.createReadStream({ _id: id });// mode: 'r'
            //TEST WRITE STREAM
            // readStream.pipe(testWriteStream);
            readStream.on("error", (err) => {
                console.log(err);
                res.status(400).send(err);
            });
            res.set("Content-Type", files[0].contentType);
            res.header("x-name", files[0].filename);
            readStream.pipe(res);
        });
    });

    var listener = app.listen(port, () => {
        console.log(`Server running on port ${listener.address().port}!`);
    });
});

module.exports = { app };
