// Lodash
const _ = require("lodash");

// User Model
const { User } = require("../../models/user.js");
// UserData Model
const { UserData } = require("../../models/userData.js");

const requestRecordBuyer = async (req, res) => {
    try {
        // Get key
        const { key } = req.body;
        // Keys
        const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];
        // Check userType, key
        if (req.user.userType !== "b" || !key || _.indexOf(keys, key) < 0) {
            throw new Error();
        }

        // Get buyerData
        const buyerData = await UserData.findOne({ _creator: req.user._id });
        // Check buyerData
        if (!buyerData) {
            throw new Error(404);
        }

        // Set message
        const message = [{
            action: "REQUESTED",
            body: { key },
            from: req.user.email,
            time: new Date().getTime().toString()
        },
        {
            action: "REQUEST",
            body: { key },
            time: new Date().getTime().toString()
        }];

        // Patch all sellerData
        await UserData.updateMany(
            { userType: "s" },
            { $push: { "message.received": message[0] } }
        );

        // Patch buyerData
        await UserData.updateOne(
            { _creator: req.user._id },
            { $push: { "message.sent": message[1] } }
        );

        // Send JSON body
        res.json({ message: `${key} requested successfully`, email: req.user.email });
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        // Not Found
        if (err && err.message === "404") {
            res.status(404).send();
        }
        // Error Bad Request
        res.status(400).send();
    }
};

const requestRecordSeller = async (req, res) => {
    try {
        // Get key, verifierEmail
        const { key, verifierEmail } = req.body;
        // Keys
        const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];
        // Check userType, verifierEmail
        if (req.user.userType !== "s" || !key || _.indexOf(keys, key) < 0 || !verifierEmail) {
            throw new Error();
        }

        // Get verifier
        const verifier = await User.findOne({ email: verifierEmail, userType: "v"});
        // Check verifier
        if (!verifier || !verifier.isActive) {
            throw new Error(404);
        }

        // Get verifierData
        const verifierData = await UserData.findOne({ _creator: verifier._id });
        // Check verifierData
        if (!verifierData) {
            throw new Error(404);
        }

        // Get sellerData
        const sellerData = await UserData.findOne({ _creator: req.user._id });
        // Check sellerData
        if (!sellerData) {
            throw new Error(404);
        }

        // Set messages
        const message = [{
            action: "REQUESTED",
            body: { key },
            from: req.user.email,
            time: new Date().getTime().toString()
        },
        {
            action: "REQUEST",
            body: { key },
            to: verifierEmail,
            time: new Date().getTime().toString()
        }];

        // Patch verifierData
        await UserData.updateOne(
            { _creator: verifier._id },
            { $push: { "message.received": message[0] } },
        );

        // Patch sellerData
        await UserData.updateOne(
            { _creator: req.user._id },
            { $push: { "message.sent": message[1] } }
        );

        // Send JSON body
        res.json({ message: `${key} requested successfully`, email: req.user.email });
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        // Not Found
        if (err && err.message === "404") {
            res.status(404).send();
        }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { requestRecordBuyer, requestRecordSeller };
