// *******************************************************************
// ###################################################################
// RECORD BODY MODEL
// {
//     allergy: [
//         {
//             data: "ALLERGY",
//             isVerified: false,
//             owner: ["OWNER"],
//             verifier: ["VERIFIER"],
//             enteredAt: "TIME"
//         }
//     ],
//     medication: [
//         {
//             data: "MEDICATION",
//             isVerified: false,
//             owner: ["OWNER"],
//             verifier: ["VERIFIER"],
//             enteredAt: "TIME"
//         }
//     ],
//     problem: [
//         {
//             data: "PROBLEM",
//             isVerified: false,
//             owner: ["OWNER"],
//             verifier: ["VERIFIER"],
//             enteredAt: "TIME"
//         }
//     ],
//     immunization: [
//         {
//             data: "IMMUNIZATION",
//             isVerified: false,
//             owner: ["OWNER"],
//             verifier: ["VERIFIER"],
//             enteredAt: "TIME"
//         }
//     ],
//     vital_sign: [
//         {
//             data: "VITAL SIGN",
//             isVerified: false,
//             owner: ["OWNER"],
//             verifier: ["VERIFIER"],
//             enteredAt: "TIME"
//         }
//     ],
//     procedure: [
//         {
//             data: "PROCEDURE",
//             isVerified: false,
//             owner: ["OWNER"],
//             verifier: ["VERIFIER"],
//             enteredAt: "TIME"
//         }
//     ],
//     log: [
//         {
//             event: "EVENT",
//             data: "DATA",
//             enteredAt: "TIME"
//         }
//     ],
//     _creator: "CREATOR _id"
// }
// *******************************************************************
// ###################################################################


// Lodash
const _ = require("lodash");
// MongoDB
const mongoose = require("mongoose");
// JSON Web Token Middleware
const jwt = require("jsonwebtoken");

const RecordSchema = new mongoose.Schema({
    allergy: [{
        data: {
            type: String,
            minlength: 1,
            trim: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        owner: {
            type: [String],
            minlength: 1,
            trim: true
        },
        verifier: {
            type: [String],
            minlength: 1,
            trim: true
        },
        enteredAt: {
            type: String,
            minlength: 1,
            trim: true
        }
    }],
    medication: [{
        data: {
            type: String,
            minlength: 1,
            trim: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        owner: {
            type: [String],
            minlength: 1,
            trim: true
        },
        verifier: {
            type: [String],
            minlength: 1,
            trim: true
        },
        enteredAt: {
            type: String,
            minlength: 1,
            trim: true
        }
    }],
    problem: [{
        data: {
            type: String,
            minlength: 1,
            trim: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        owner: {
            type: [String],
            minlength: 1,
            trim: true
        },
        verifier: {
            type: [String],
            minlength: 1,
            trim: true
        },
        enteredAt: {
            type: String,
            minlength: 1,
            trim: true
        }
    }],
    immunization: [{
        data: {
            type: String,
            minlength: 1,
            trim: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        owner: {
            type: [String],
            minlength: 1,
            trim: true
        },
        verifier: {
            type: [String],
            minlength: 1,
            trim: true
        },
        enteredAt: {
            type: String,
            minlength: 1,
            trim: true
        }
    }],
    vital_sign: [{
        data: {
            type: String,
            minlength: 1,
            trim: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        owner: {
            type: [String],
            minlength: 1,
            trim: true
        },
        verifier: {
            type: [String],
            minlength: 1,
            trim: true
        },
        enteredAt: {
            type: String,
            minlength: 1,
            trim: true
        }
    }],
    procedure: [{
        data: {
            type: String,
            minlength: 1,
            trim: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        owner: {
            type: [String],
            minlength: 1,
            trim: true
        },
        verifier: {
            type: [String],
            minlength: 1,
            trim: true
        },
        enteredAt: {
            type: String,
            minlength: 1,
            trim: true
        }
    }],
    log: [{
        event: {
            type: String,
            minlength: 1,
            trim: true
        },
        data: {
            type: String,
            minlength: 1,
            trim: true
        },
        enteredAt: {
            type: String,
            minlength: 1,
            trim: true
        }
    }],
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
RecordSchema.methods.toJSON = function () {
    const record = this;
    // Return an object
    const recordObject = record.toObject();

    // Create object to return
    const returnObject = {
        allergy: [],
        medication: [],
        problem: [],
        immunization: [],
        vital_sign: [],
        procedure: []
    };

    // Populate function
    const populateRecord = (key) => {
        recordObject[key].forEach((rec) => {
            returnObject[key].push({ _id: rec._id, data: rec.data, isVerified: rec.isVerified });
        });
    };

    // Populate returnObject
    populateRecord("allergy");
    populateRecord("medication");
    populateRecord("problem");
    populateRecord("immunization");
    populateRecord("vital_sign");
    populateRecord("procedure");

    // Return
    return returnObject;
};
// ###################################################################
// *******************************************************************

// *******************************************************************
// ###################################################################
// INSTANCE METHOD
// ###################################################################
// To generate owner
RecordSchema.methods.generateOwnerToken = function (owner) {
    const record = this;

    // Sign the owner token
    const ownerToken = jwt.sign(
        {
            owner: owner._id.toHexString(),
            record: record._id.toHexString()
        },
        process.env.USER_SECRET
    );

    // Return owner token
    return ownerToken;
};
// ###################################################################
// To find and delete by record _id
RecordSchema.methods.deleteByRecordId = function (id) {
    const record = this;

    // Flag
    let flag = false;
    // Keys
    const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];

    // Update record body
    const findAndDelete = (key) => {
        // Get rec
        const rec = _.remove(record[key], (res => res._id.toHexString() === id));
        // Check rec
        if (!_.isEmpty(rec)) {
            // Update the record log
            record.log.push({
                event: `DELETE:USER${id}:REC${record._id}:DATE${new Date().getTime().toString()}`,
                data: `${key}:${rec[0].data}`,
                enteredAt: new Date().toUTCString()
            });

            // Flip flag
            flag = true;
        }
    };
    keys.forEach(key => findAndDelete(key));

    if (flag) {
        // Return record
        return record;
    } else {
        // Return null
        return null;
    }
};
// ###################################################################
// To find and patch by record _id
RecordSchema.methods.patchByRecordId = function (id, value, verified) {
    const record = this;

    // Flag
    let flag = false;
    // Keys
    const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];

    // Update record body
    const findAndPatch = (key) => {
        // Get rec
        const rec = _.remove(record[key], (res => res._id.toHexString() === id));
        if (!_.isEmpty(rec)) {
            // Update the rec body
            rec[0].data = value;
            rec[0].enteredAt = new Date().getTime().toString();
            if (verified) {
                rec[0].isVerified = true;
            } else {
                rec[0].isVerified = false;
            }

            // Push the rec body
            record[key].push(rec[0]);

            // Update the record log
            record.log.push({
                event: `PATCH:USER${id}:REC${record._id}:DATE${new Date().getTime().toString()}`,
                data: `${key}:${rec[0].data}`,
                enteredAt: new Date().toUTCString()
            });

            // Flip flag
            flag = true;
        }
    };
    keys.forEach(key => findAndPatch(key));

    if (flag) {
        // Return record
        return record;
    } else {
        // Return null
        return null;
    }
};
// ###################################################################
// To find ownerRecords by owner _id
RecordSchema.methods.findByOwnerRecords = function (id, key) {
    const record = this;

    // Create ownerRecords
    const ownerRecords = [];

    // Check record[key]
    record[key].forEach((rec) => {
        // Check isVerified
        if (rec.isVerified) {
            let decoded;

            try {
                // Get object with owner and record property
                decoded = jwt.verify(rec.owner[0], process.env.USER_SECRET);
            } catch (err) {
                throw err;
            }

            if (decoded.owner === id.toHexString()) {
                // Update the sellerRecord body
                ownerRecords.push(rec);
            }
        }
    });

    return ownerRecords;
};
// ###################################################################
// *******************************************************************

const Record = mongoose.model("Record", RecordSchema);

module.exports = { Record };
