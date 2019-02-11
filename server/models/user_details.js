const mongoose = require("mongoose");
const validator = require("validator");

const UserDetailsSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: true,
        validate: {
            validator: value => value >= 0,
            message: "{VALUE} must be positive!"
        }
    },
    weight: {
        type: Number,
        required: true,
        validate: {
            validator: value => value >= 0,
            message: "{VALUE} must be positive!"
        }
    },
    sex: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                if (validator.matches(value, /male/i) || validator.matches(value, /female/i)) {
                    return true;
                }
                return false;
            },
            message: "{VALUE} should be male or female!"
        }
    },
    occupation: {
        type: String
    },
    address: {
        type: String
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

const UserDetails = mongoose.model("User Details", UserDetailsSchema);

module.exports = { UserDetails };
