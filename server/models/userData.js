// *******************************************************************
// ###################################################################
// USER DATA BODY MODEL
// {
//     name: [string],
//     address: [string],
//     userType: [string], // VALID USER TYPE (b, s, v)
//     message: {
//         sent: [
//             {
//             // ACTION
//             // [BUYER -> REQUEST]
//             // [SELLER -> REQUEST, SHARE]
//             // [VERIFIER -> VERIFY, SHARE]
//             action: [string], // VALID ACTION
//             // BODY
//             // [BUYER -> SELLER ({ key: [string] })]
//             // [SELLER -> VERIFIER ({ key: [string] }), BUYER ({ key: [string], count: [number] })]
//             // [VERIFIER -> SELLER ({ key: [string], count: [number] })]
//             body: [object] // VALID OBJECT
//             // TO
//             // [BUYER -> SELLERS]
//             // [SELLER -> BUYER, VERIFIER]
//             // [VERIFIER -> SELLER]
//             to: [string], // VALID EMAIL ID
//             time: [number]
//             }
//         ],
//         received: [
//             {
//             // ACTION
//             // [BUYER <- SHARE]
//             // [SELLER <- REQUEST, VERIFY]
//             // [VERIFIER <- REQUEST]
//             action: [string], // VALID ACTION
//             // BODY
//             // [BUYER <- SELLERS ({ key: [string], count: [number] })]
//             // [SELLER <- BUYER ({ key: [string] }), VERIFIER ({ key: [string], count: [number] })]
//             // [VERIFIER <- SELLER ({ key: [string] })]
//             body: [object] // VALID OBJECT
//             // FROM
//             // [BUYER <- SELLERS]
//             // [SELLER <- BUYER, VERIFIER]
//             // [VERIFIER <- SELLERS]
//             from: [string], // VALID EMAIL ID
//             time: [number]
//             }
//         ]
//     },
//     buyer: {
//         bio: [string]
//     },
//     seller: {
//         age: [string], // VALID AGE (greater than 0)
//         weight: [string], // VALID WEIGHT (greater than 0)
//         sex: [string], // VALID SEX (male, female)
//         occupation: [string]
//     },
//     verifier: {
//         bio: [string]
//     },
//     _creator: [string] // UNIQUE USER IDENTIFIER
// }
// *******************************************************************
// ###################################################################

// Lodash
const _ = require("lodash");
// MongoDB
const mongoose = require("mongoose");
// Validation Middleware
const validator = require("validator");

// Create UserData schema
const UserDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => {
                if (validator.matches(value, /b/i) || validator.matches(value, /s/i) || validator.matches(value, /v/i)) {
                    return true;
                }
                return false;
            },
            message: "{VALUE} should be b/s/v or B/S/V!"
        }
    },
    message: {
        sent: [{
            action: {
                type: String,
                trim: true
            },
            body: {
                type: mongoose.Schema.Types.Mixed
            },
            to: {
                type: String,
                trim: true
            },
            time: {
                type: Number,
                required: true,
                minlength: 1,
                trim: true
            }
        }],
        received: [{
            action: {
                type: String,
                trim: true
            },
            body: {
                type: mongoose.Schema.Types.Mixed
            },
            from: {
                type: String,
                trim: true
            },
            time: {
                type: Number,
                required: true,
                minlength: 1,
                trim: true
            }
        }]
    },
    buyer: {
        bio: {
            type: String,
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
    verifier: {
        bio: {
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
UserDataSchema.methods.toJSON = function () {
    const userData = this;
    // Return an object
    const userDataObject = userData.toObject();

    // Return _id, email, userType from userObject
    return _.pick(userDataObject, ["name", "address", "userType", "seller", "buyer", "verifier"]);
};
// ###################################################################
// *******************************************************************

// *******************************************************************
// ###################################################################
// HOOKS
// ###################################################################
// updateOne Hook
UserDataSchema.pre("updateOne", function (next) {
    const User = this;

    const { seller } = User.getUpdate().$set;

    // Check seller
    if (seller) {
        // Check, validate age
        if (seller.age && seller.age < 0) {
            throw new Error();
        }

        // Check, validate weight
        if (seller.weight && seller.weight < 0) {
            throw new Error();
        }

        // Check, validate sex
        if (seller.sex && !validator.matches(seller.sex, /male/i) && !validator.matches(seller.sex, /female/i)) {
            throw new Error();
        }
    }

    next();
});
// ###################################################################
// *******************************************************************

const UserData = mongoose.model("UserData", UserDataSchema);

module.exports = { UserData };
