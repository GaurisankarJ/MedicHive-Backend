// *******************************************************************
// ###################################################################
// USER DETAIL BODY MODEL
// {
//     name: "NAME",
//     address: "ADDRESS",
//     message: {
//         sent: ["SENT"],
//         received: ["RECEIVED"]
//     },
//     seller: {
//         age: 55,
//         weight: 99,
//         sex: "MALE/FEMALE",
//         occupation: "OCCUPATION"
//     },
//     _creator: "CREATOR _id"
// }
// *******************************************************************
// ###################################################################

// Lodash
const _ = require("lodash");
// MongoDB
const mongoose = require("mongoose");
// Validation Middleware
const validator = require("validator");

// Create UserDetails schema
const UserDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    message: {
        sent: {
            type: [String],
            trim: true
        },
        received: {
            type: [String],
            trim: true
        }
    },
    seller: {
        age: {
            type: Number,
            validate: {
                validator: value => value >= 0,
                message: "{VALUE} must be positive!"
            }
        },
        weight: {
            type: Number,
            validate: {
                validator: value => value >= 0,
                message: "{VALUE} must be positive!"
            }
        },
        sex: {
            type: String,
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
            type: String,
            trim: true
        }
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

// *******************************************************************
// ###################################################################
// OVERRIDE METHOD, for every call that returns a JSON object
// ###################################################################
UserDetailSchema.methods.toJSON = function () {
    const userDetails = this;
    // Return an object
    const userDetailsObject = userDetails.toObject();

    // Return _id, email, userType from userObject
    return _.pick(userDetailsObject, ["name", "address", "seller"]);
};
// ###################################################################
// *******************************************************************

const UserDetail = mongoose.model("UserDetail", UserDetailSchema);

module.exports = { UserDetail };
