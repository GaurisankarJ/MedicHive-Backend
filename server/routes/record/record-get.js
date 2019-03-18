const _ = require("lodash");

const { Record } = require("../../models/record.js");

const getRecord = async (req, res) => {
    try {
        const record = await Record.find({ _creator: req.user._id });

        if (_.isEmpty(record)) {
            throw new Error(404);
        }

        res.send({ record });
    } catch (err) {
        console.log(err);
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        if (err.message === "404") {
            res.status(404).send();
        }
        res.status(400).send();
    }
};

module.exports = { getRecord };
