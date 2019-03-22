// Lodash
const _ = require("lodash");
// ObjectID
const { ObjectID } = require("mongodb");

// Record Model
const { Record } = require("../../models/record.js");

const patchRecord = async (req, res) => {
    try {
        // Get key, value from request body
        const { key, value } = req.body;

        // Check key and value
        if (!key || !value) {
            throw new Error();
        }

        // Keys
        const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];

        // Find record
        const record = await Record.findOne({ _creator: req.user._id });
        // Check record
        if (!record) {
            throw new Error(404);
        }

        // Check key against keys
        if (_.indexOf(keys, key) < 0) {
            throw new Error();
        } else if (_.indexOf(keys, key) >= 0) {
            // Create owner
            const owner = record.generateOwnerToken(req.user);

            // Update the record body
            record[key].push({
                data: value,
                owner
            });

            // Update the record log
            record.log.push({
                event: `POST:USER${req.user._id}:REC${record._id}:DATE${new Date().getTime().toString()}`,
                data: `${key}:${value}`,
                enteredAt: new Date().toUTCString()
            });

            // Patch userDetails
            await Record.findOneAndUpdate(
                { _creator: req.user._id },
                { $set: record },
                { new: true }
            );

            // Send JSON body
            res.json({ message: `${key} updated`, email: req.user.email });
        }
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
        // Get record id
        const { id } = req.params;
        // Check id
        if (!ObjectID.isValid(id)) {
            throw new Error();
        }

        // Get value
        const { value } = req.body;
        // Check value
        if (!value) {
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

        // Update record
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
