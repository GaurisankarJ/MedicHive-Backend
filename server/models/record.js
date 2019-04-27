// *******************************************************************
// ###################################################################
// RECORD BODY MODEL
// {
//     allergy: [
//         {
//             data: [string],
//             owner: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             verifier: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             createdAt: [number],
//             updatedAt: [number]
//         }
//     ],
//     medication: [
//         {
//             data: [string],
//             owner: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             verifier: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             createdAt: [number],
//             updatedAt: [number]
//         }
//     ],
//     problem: [
//         {
//             data: [string],
//             owner: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             verifier: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             createdAt: [number],
//             updatedAt: [number]
//         }
//     ],
//     immunization: [
//         {
//             data: [string],
//             owner: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             verifier: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             createdAt: [number],
//             updatedAt: [number]
//         }
//     ],
//     vital_sign: [
//         {
//             data: [string],
//             owner: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             verifier: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             createdAt: [number],
//             updatedAt: [number]
//         }
//     ],
//     procedure: [
//         {
//             data: [string],
//             owner: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             verifier: [
//                 {
//                     email: [string], // VALID EMAIL ID
//                     sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
//                 }
//             ],
//             createdAt: [number],
//             updatedAt: [number]
//         }
//     ],
//     log: [
//         {
//             // ACTION
//             // BUYER -> REQUEST, DELETE
//             // SELLER -> ADD, DELETE, UPDATE, VERIFY, SHARE
//             // VERIFIER -> VERIFY, ADD, DELETE, UPDATE, SHARE
//             action: [string],
//             // BODY
//             // [BUYER <- SELLERS ({ key: [string], value: [string] })]
//             // [SELLER ({ key: [string], value: [string] }) <- VERIFIER ({ key: [string], value: [string] })]
//             // [VERIFIER ({ key: [string], value: [string] }) <- SELLER ({ key: [string], value: [string] })]
//             body: [object],
//             createdAt: [number]
//         }
//     ],
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
// JSON Web Token Middleware
const jwt = require("jsonwebtoken");

const RecordSchema = new mongoose.Schema({
    allergy: [{
        data: {
            type: String,
            minlength: 1,
            trim: true
        },
        owner: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        verifier: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        createdAt: {
            type: Number,
            required: true,
            minlength: 1,
            trim: true
        },
        updatedAt: {
            type: Number,
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
        owner: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        verifier: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        createdAt: {
            type: Number,
            required: true,
            minlength: 1,
            trim: true
        },
        updatedAt: {
            type: Number,
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
        owner: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        verifier: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        createdAt: {
            type: Number,
            required: true,
            minlength: 1,
            trim: true
        },
        updatedAt: {
            type: Number,
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
        owner: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        verifier: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        createdAt: {
            type: Number,
            required: true,
            minlength: 1,
            trim: true
        },
        updatedAt: {
            type: Number,
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
        owner: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        verifier: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        createdAt: {
            type: Number,
            required: true,
            minlength: 1,
            trim: true
        },
        updatedAt: {
            type: Number,
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
        owner: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        verifier: [{
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email!"
                }
            },
            sign: {
                type: String,
                required: true
            }
        }],
        createdAt: {
            type: Number,
            required: true,
            minlength: 1,
            trim: true
        },
        updatedAt: {
            type: Number,
            minlength: 1,
            trim: true
        }
    }],
    log: [{
        action: {
            type: String,
            minlength: 1,
            trim: true
        },
        body: {
            type: mongoose.Schema.Types.Mixed
        },
        createdAt: {
            type: Number,
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
            const owner = rec.owner.map(res => res.email);
            const verifier = rec.verifier.map(res => res.email);
            returnObject[key].push({ _id: rec._id, data: rec.data, owner, verifier, createdAt: rec.createdAt, updatedAt: rec.updatedAt });
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
            record: record._id.toHexString(),
            time: new Date().getTime()
        },
        process.env.USER_SECRET
    );

    // Return owner token
    return ownerToken;
};
// ###################################################################
// To find and delete by record _id
RecordSchema.methods.deleteByRecordId = function (id, user) {
    const record = this;

    // Flag
    let flag = false;
    // Keys
    const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];

    // Update record body
    const findAndDelete = (key) => {
        // Get rec
        const rec = _.remove(record[key], (res => res._id.toHexString() === id));// Removes all elements matching condition

        // Check rec
        if (!_.isEmpty(rec)) {
            // Check if buyer, seller or verifier
            if (user.userType === "b") {
                // Update the record log
                record.log.push({
                    action: `DELETE:BUYER${user._id.toHexString()}:RECORD${record._id}:DATE${new Date().getTime().toString()}`,
                    body: { key: id },
                    createdAt: new Date().getTime()
                });
            } else if (user.userType === "s") {
                // Update the record log
                record.log.push({
                    action: `DELETE:SELLER${user._id.toHexString()}:RECORD${record._id}:DATE${new Date().getTime().toString()}`,
                    body: { key: id },
                    createdAt: new Date().getTime()
                });
            } else if (user.userType === "v") {
                // Update the record log
                record.log.push({
                    action: `DELETE:VERIFIER${user._id.toHexString()}:RECORD${record._id}:DATE${new Date().getTime().toString()}`,
                    body: { key: id },
                    createdAt: new Date().getTime()
                });
            }

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
// To find and update by record _id
RecordSchema.methods.updateByRecordId = function (id, value, user) {
    const record = this;

    // Flag
    let flag = false;
    // Keys
    const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];

    // Update record body
    const findAndUpdate = (key) => {
        // Get rec
        const rec = _.remove(record[key], (res => res._id.toHexString() === id));// Removes all elements matching condition

        // Check rec
        if (!_.isEmpty(rec)) {
            // Update the rec body
            rec[0].data = value;
            rec[0].updatedAt = new Date().getTime();

            // Check if seller or verifier
            if (user.userType === "s") {
                rec[0].verifier = [];

                // Update the record log
                record.log.push({
                    action: `UPDATE:SELLER${user._id.toHexString()}:RECORD${record._id}:DATE${new Date().getTime().toString()}`,
                    body: { key: id, value },
                    createdAt: new Date().getTime()
                });
            } else if (user.userType === "v") {
                // Update the record log
                record.log.push({
                    action: `UPDATE:VERIFIER${user._id.toHexString()}:RECORD${record._id}:DATE${new Date().getTime().toString()}`,
                    body: { key: id, value },
                    createdAt: new Date().getTime()
                });
            }

            // Push the rec body
            record[key].push(rec[0]);

            // Flip flag
            flag = true;
        }
    };
    keys.forEach(key => findAndUpdate(key));

    if (flag) {
        // Return record
        return record;
    } else {
        // Return null
        return null;
    }
};
// ###################################################################
// To find verified ownerRecords by owner _id
RecordSchema.methods.findVerifiedOwnerRecords = function (id, key) {
    const record = this;

    // Create ownerRecords
    const ownerRecords = [];

    // Check record[key]
    record[key].forEach((rec) => {
        // Check if verified
        if (rec.verifier.length !== 0) {
            let decoded;

            try {
                // Get object with owner, record, time property
                decoded = jwt.verify(rec.owner[0].sign, process.env.USER_SECRET);
            } catch (err) {
                throw err;
            }

            if (decoded.owner === id.toHexString()) {
                // Update the ownerRecords body
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
