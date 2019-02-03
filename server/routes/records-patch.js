const _ = require("lodash");
const { ObjectID } = require("mongodb");

const { Record } = require("./../models/record.js");

const patchRecords = (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ["disease", "medication", "doctor", "enteredAt"]);
    body.enteredAt = new Date().toString();

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(err);
    }
    Record.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((record) => {
        if (!record) {
            res.status(404).send();
        }
        res.status(200).send({ record });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
};

module.exports = { patchRecords };