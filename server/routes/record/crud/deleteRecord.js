// ObjectID
const { ObjectID } = require("mongodb");
// Record Model
const { Record } = require("../../../models/record.js");

const deleteRecord = async (req, res) => {
    try {
        // Delete record
        const record = await Record.deleteOne({ _creator: req.user._id });
        // Check record
        if (record.deletedCount !== 1) {
            throw new Error(404);
        }

        // Send the status
        res.status(200).send();
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

const deleteRecordById = async (req, res) => {
    try {
        // Get record id from params body
        const { id } = req.params;
        // Check id
        if (!ObjectID.isValid(id)) {
            throw new Error();
        }

        // Get record
        let record = await Record.findOne({ _creator: req.user._id });
        // Check record
        if (!record) {
            throw new Error(404);
        }

        // Update record body
        record = await record.deleteByRecordId(id, req.user);
        // Check record
        if (!record) {
            throw new Error(404);
        }

        // Update record
        await Record.updateOne(
            { _creator: req.user._id },
            { $set: record }
        );

        // Send JSON body
        res.json({ message: "record deleted", email: req.user.email });
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

module.exports = { deleteRecord, deleteRecordById };
