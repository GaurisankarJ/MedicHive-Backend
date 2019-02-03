const mongoose = require("mongoose");
const GridFS = require("gridfs-stream");

mongoose.Promise = global.Promise;
GridFS.mongo = mongoose.mongo;
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
const mongoDriver = mongoose.mongo;
const gfs = new GridFS(db, mongoDriver);

module.exports = { mongoose, gfs };