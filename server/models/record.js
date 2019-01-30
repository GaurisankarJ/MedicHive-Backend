const mongoose = require("mongoose");

var RecordSchema = new mongoose.Schema({
    disease: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    medication: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    doctor: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
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

var Record = mongoose.model("Record", RecordSchema);

module.exports = { Record };