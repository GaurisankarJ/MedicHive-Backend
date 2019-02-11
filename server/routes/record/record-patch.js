const { Record } = require("../../models/record.js");

const patchRecord = async (req, res) => {
    try {
        const record = await Record.find({ _creator: req.user._id });
        if (!record) {
            res.status(404).send();
        }
        const body = record[0];
        body.enteredAt = new Date().toString();

        const { type } = req.body;
        switch (type) {
        case "allergy":
            body.allergy.push(req.body.record);
            body.log.push(`Allergy : ${req.body.record} : ${new Date().toString()}`);
            break;
        case "medication":
            body.medication.push(req.body.record);
            body.log.push(`Medication : ${req.body.record} : ${new Date().toString()}`);
            break;
        case "problem":
            body.problem.push(req.body.record);
            body.log.push(`Problem : ${req.body.record} : ${new Date().toString()}`);
            break;
        case "immunization":
            body.immunization.push(req.body.record);
            body.log.push(`Immunization : ${req.body.record} : ${new Date().toString()}`);
            break;
        case "vital_sign":
            body.vital_sign.push(req.body.record);
            body.log.push(`Vital Sign : ${req.body.record} : ${new Date().toString()}`);
            break;
        case "procedure":
            body.procedure.push(req.body.record);
            body.log.push(`Procedure : ${req.body.record} : ${new Date().toString()}`);
            break;
        default:
            break;
        }

        const updatedRecord = await Record.findOneAndUpdate(
            { _creator: req.user._id },
            { $set: body },
            { new: true }
        );
        if (!updatedRecord) {
            res.status(404).send();
        }

        res.send({
            enteredAt: updatedRecord.enteredAt
        });
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        res.status(400).send();
    }
};

module.exports = { patchRecord };
