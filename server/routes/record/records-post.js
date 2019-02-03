const { Record } = require("../../models/record.js");

const postRecords = (req, res) => {
    var record = new Record({
        disease: req.body.disease,
        medication: req.body.medication,
        doctor: req.body.doctor,
        enteredAt: new Date().toString(),
        _creator: req.user._id
    });
    record.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        if (process.env.NODE_ENV != "test") { console.log(process.env); }
        res.status(400).send();
    });
};

module.exports = { postRecords };