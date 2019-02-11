const { Record } = require("../../models/record.js");

const postRecord = async (req, res) => {
    try {
        const body = {
            enteredAt: new Date().toString(),
            _creator: req.user._id
        };

        const record = new Record(body);
        const doc = await record.save();

        res.send(doc);
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(process.env); }
        res.status(400).send();
    }
};

module.exports = { postRecord };
