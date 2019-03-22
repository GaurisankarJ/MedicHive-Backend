// Record Model
const { Record } = require("../../../models/record.js");

const getRecord = async (req, res) => {
    try {
        // Get record
        const record = await Record.findOne({ _creator: req.user._id });
        // Check record
        if (!record) {
            throw new Error(404);
        }

        // Send JSON body
        res.send({ email: req.user.email, record });
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

module.exports = { getRecord };
