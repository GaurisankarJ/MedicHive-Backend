const mongo = require("mongodb");
const GridFS = require("gridfs-stream");

const getDocuments = (req, res) => {
    mongo.MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
        if (err) {
            console.log("Unable to connect to MongoDB server!", err);
        }

        const regex = new RegExp("([^/]+)$", "gi");
        const dbName = process.env.MONGODB_URI.match(regex);

        const db = client.db(dbName[0]);

        const gfs = new GridFS(db, mongo);
        gfs.files.find({ metadata: req.user._id }).toArray((error, files) => {
            if (error) {
                if (process.env.NODE_ENV !== "test") { console.log(error); }
                res.status(400).send();
            }
            const docs = files.map((file) => {
                return {
                    _id: file._id,
                    name: file.filename,
                    date: file.uploadDate,
                    type: file.metadata[1]
                };
            });
            res.send({ docs });
        });
    });
};

module.exports = { getDocuments };
