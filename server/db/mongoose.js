// MongoDB
const mongoose = require("mongoose");
// GridFS MongoDB
const GridFS = require("gridfs-stream");

// Set mongoose Promise
mongoose.Promise = global.Promise;
// Connect GridFS to mongoose
GridFS.mongo = mongoose.mongo;
// Connect mongoose to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Get db
const db = mongoose.connection;
// Get mongoDriver
const mongoDriver = mongoose.mongo;
// Get gfs
const gfs = new GridFS(db, mongoDriver);

// Options, mongoose
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

module.exports = { mongoose, gfs };
