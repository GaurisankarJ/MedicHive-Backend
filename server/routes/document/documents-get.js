const mongo = require("mongodb");
const GridFS = require("gridfs-stream");

const getDocuments = (req, res) => {
    mongo.MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
        if (err) {
            console.log("Unable to connect to MongoDB server!", err);
        }

        var regex = new RegExp("([^/]+)$", "gi");
        var dbName = process.env.MONGODB_URI.match(regex);

        db = client.db(dbName[0]);

        const gfs = new GridFS(db, mongo);
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
};

module.exports = { getDocuments };