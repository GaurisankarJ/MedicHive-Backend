const { Record } = require("./../models/record.js");

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
        console.log(err);
        res.status(400).send(err);
    });
};

module.exports = { postRecords };