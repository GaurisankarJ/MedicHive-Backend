const mongoose = require("mongoose");

var DocumentSchema = new mongoose.Schema({
    document: {
        type: Buffer,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    enteredAt: {
        type: String,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

var Document = mongoose.model("Document", DocumentSchema);

module.exports = { Document };