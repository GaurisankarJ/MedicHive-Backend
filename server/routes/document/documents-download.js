const mongo = require("mongodb");
const GridFS = require("gridfs-stream");

const documentDownload = (req, res) => {
    mongo.MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
        if (err) {
            console.log("Unable to connect to MongoDB server!", err);
        }
        var regex = new RegExp("([^/]+)$", "gi");
        var dbName = process.env.MONGODB_URI.match(regex);
        
        db = client.db(dbName[0]);
        
        const gfs = new GridFS(db, mongo);
        
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
};

module.exports = { documentDownload };