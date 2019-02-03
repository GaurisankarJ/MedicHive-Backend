const { Record } = require("./../models/record.js");

const getRecords = (req, res) => {
    Record.find({ _creator: req.user._id }).then((records) => {
        if (!records) {
            res.status(404).send();
        }
        res.send({ records });
    }, (err) => {
        console.log(err);
        res.status(400).send(err);
    });
};

module.exports = { getRecords };