const mongo = require("mongodb");
const GridFS = require("gridfs-stream");

const downloadDocument = (req, res) => {
    mongo.MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
        if (err) {
            console.log("Unable to connect to MongoDB server!", err);
        }

        const regex = new RegExp("([^/]+)$", "gi");
        const dbName = process.env.MONGODB_URI.match(regex);

        const db = client.db(dbName[0]);

        const gfs = new GridFS(db, mongo);

        const { id } = req.params;
        const creator = req.user._id;

        gfs.files.find({ _id: new mongo.ObjectID(id), metadata: new mongo.ObjectID(creator) })
            .toArray((error, files) => {
                if (error) {
                    console.log(error);
                    res.status(400).send();
                }

                // TEST WRITE STREAM
                // const testWriteStream = fs.createWriteStream("file.jpg");

                const readStream = gfs.createReadStream({ _id: id });// mode: 'r'

                // TEST WRITE STREAM
                // readStream.pipe(testWriteStream);

                readStream.on("error", (e) => {
                    console.log(e);
                    res.status(400).send();
                });

                res.set("Content-Type", files[0].contentType);
                res.header("x-name", files[0].filename);
                readStream.pipe(res);
            });
    });
};

module.exports = { downloadDocument };
