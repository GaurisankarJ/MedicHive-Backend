const { Record } = require("../../models/record.js");

const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findOneAndDelete({ _creator: req.user._id });
        if (!record) {
            res.status(404).send();
        }

        res.status(200).send();
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        res.status(400).send();
    }
};

module.exports = { deleteRecord };
