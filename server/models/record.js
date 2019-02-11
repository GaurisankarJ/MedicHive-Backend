const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
    allergy: {
        type: [String],
        minlength: 1,
        trim: true
    },
    medication: {
        type: [String],
        minlength: 1,
        trim: true
    },
    problem: {
        type: [String],
        minlength: 1,
        trim: true
    },
    immunization: {
        type: [String],
        minlength: 1,
        trim: true
    },
    vital_sign: {
        type: [String],
        minlength: 1,
        trim: true
    },
    procedure: {
        type: [String],
        minlength: 1,
        trim: true
    },
    log: {
        type: [String],
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

const Record = mongoose.model("Record", RecordSchema);

module.exports = { Record };
