const { Record } = require("../../models/record.js");

const getRecord = async (req, res) => {
    try {
        const record = await Record.find({ _creator: req.user._id });
        if (!record) {
            res.status(404).send();
        }

        res.send({ record });
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        res.status(400).send();
    }
};

module.exports = { getRecord };
