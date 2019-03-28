// Lodash
const _ = require("lodash");
// ObjectID
const { ObjectID } = require("mongodb");

// Record Model
const { Record } = require("../../../models/record.js");
// User Model
const { User } = require("../../../models/user.js");

const patchRecord = async (req, res) => {
    try {
        // Get key, value from request body
        const { key, value } = req.body;
        // Keys
        const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];
        // Check userType, key, value
        if (req.user.userType === "b" || !key || _.indexOf(keys, key) < 0 || !value) {
            throw new Error();
        }

        // Get record
        const record = await Record.findOne({ _creator: req.user._id });
        // Check record
        if (!record) {
            throw new Error(404);
        }

        if (req.user.userType === "s") {
            // Create ownerToken
            const ownerToken = record.generateOwnerToken(req.user);

            // Check value array
            value.forEach((val) => {
                // Update the record body
                record[key].push({
                    data: val,
                    owner: ownerToken
                });
            });

            // Update the record log
            record.log.push({
                event: `POST:USER${req.user._id}:REC${record._id}:DATE${new Date().getTime().toString()}`,
                data: `${key}:${value}`,
                enteredAt: new Date().toUTCString()
            });

            // Patch record
            await Record.findOneAndUpdate(
                { _creator: req.user._id },
                { $set: record },
                { new: true }
            );
        } else if (req.user.userType === "v") {
            // Get owner from request body
            const { owner } = req.body;
            // Check to
            if (!owner) {
                throw new Error();
            }

            // Get seller
            const seller = await User.findOne({ email: owner });
            // Check seller
            if (!seller || seller.userType !== "s") {
                throw new Error(404);
            }

            // Create ownerToken
            const ownerToken = record.generateOwnerToken(seller);

            // Create verifierToken
            const verifierToken = record.generateOwnerToken(req.user);

            // Check value array
            value.forEach((val) => {
                // Update the record body
                record[key].push({
                    data: val,
                    owner: ownerToken,
                    verifier: verifierToken
                });
            });

            // Update the record log
            record.log.push({
                event: `POST:USER${seller._id}:VERIFIER${req.user._id}:REC${record._id}:DATE${new Date().getTime().toString()}`,
                data: `${key}:${value}`,
                enteredAt: new Date().toUTCString()
            });

            // Patch record
            await Record.findOneAndUpdate(
                { _creator: req.user._id },
                { $set: record },
                { new: true }
            );
        }

        // Send JSON body
        res.json({ message: `${key} updated`, email: req.user.email });
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        // Not Found
        if (err && err.message === "404") {
            res.status(404).send();
        }
        // Error Bad Request
        res.status(400).send();
    }
};

const patchRecordById = async (req, res) => {
    try {
        // Get record id from params body
        const { id } = req.params;
        // Get value
        const { value } = req.body;
        // Check userType, id, value
        if (req.user.userType === "b" || !ObjectID.isValid(id) || !value) {
            throw new Error();
        }

        // Get record
        let record = await Record.findOne({ _creator: req.user._id });
        // Check record
        if (!record) {
            throw new Error(404);
        }

        // Update record body
        record = await record.patchByRecordId(id, value);
        // Check record
        if (!record) {
            throw new Error(404);
        }

        // Update the record log
        record.log.push({
            event: `PATCH:USER${user._id}:REC${record._id}:DATE${new Date().getTime().toString()}`,
            data: `${key}:${value}`,
            enteredAt: new Date().toUTCString()
        });

        // Patch record
        await Record.findOneAndUpdate(
            { _creator: req.user._id },
            { $set: record },
            { new: true }
        );

        // Send JSON body
        res.json({ message: "record updated", email: req.user.email });
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        // Not Found
        if (err && err.message === "404") {
            res.status(404).send();
        }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { patchRecord, patchRecordById };
