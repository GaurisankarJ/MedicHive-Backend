const { ObjectID } = require("mongodb");

const { Record } = require("./../models/record.js");

const deleteRecords = (req, res) => {
    var id = req.params.id;
    var creator = req.user._id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(err);
    }
    Record.findOneAndDelete({ _id: id, _creator: creator }).then((record) => {
        if (!record) {
            res.status(404).send();
        }
        res.status(200).send({ record });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
};

module.exports = { deleteRecords };