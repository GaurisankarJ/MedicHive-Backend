// Lodash
const _ = require("lodash");
// ObjectID
const { ObjectID } = require("mongodb");

// User Model
const { User } = require("../../models/user.js");
// UserData Model
const { UserData } = require("../../models/userData.js");
// Record Model
const { Record } = require("../../models/record.js");

const sellerVerifyRecord = async (req, res) => {
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
        const verifier = await User.findOne({ email: verifierEmail, userType: "v" });
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

        // Get sellerRecord
        const sellerRecord = await Record.findOne({ _creator: req.user._id });
        // Check sellerRecord
        if (!sellerRecord) {
            throw new Error(404);
        }

        // Set message
        const message = [{
            action: "VERIFY",
            body: { key },
            from: req.user.email,
            time: new Date().getTime()
        },
        {
            action: "VERIFY",
            body: { key },
            to: verifierEmail,
            time: new Date().getTime()
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
        res.json({ message: "verification requested successfully", email: req.user.email });
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

const verifierGetRecord = async (req, res) => {
    try {
        // Get emailId from query body
        const { id } = req.query;
        // Check userType, verifierEmail
        if (req.user.userType !== "v" || !id || !ObjectID.isValid(id)) {
            throw new Error();
        }

        // Get verifierData
        const verifierData = await UserData.findOne({ _creator: req.user._id });
        // Check verifierData
        if (!verifierData) {
            throw new Error(404);
        }

        let sellerEmail;
        let keyToVerify;
        // Get message
        verifierData.message.received.forEach((message) => {
            // Check id
            if (id === message._id.toHexString()) {
                // Check action
                if (message.action === "VERIFY") {
                    // Set sellerEmail
                    sellerEmail = message.from;
                    // Set body
                    keyToVerify = message.body.key;
                }
            }
        });

        // Check sellerEmail
        if (!sellerEmail) {
            throw new Error(400);
        } else {
            // Get seller
            const seller = await User.findOne({ email: sellerEmail, isActive: true });
            // Check seller
            if (!seller) {
                throw new Error(404);
            }

            // Get sellerRecord
            const sellerRecord = await Record.findOne({ _creator: seller._id });
            // Check sellerRecord
            if (!sellerRecord) {
                throw new Error(404);
            }
            // Filter sellerRecord
            sellerRecord[keyToVerify] = sellerRecord[keyToVerify].filter(record => record.verifier.length === 0);

            // Send JSON body
            res.json({ record: sellerRecord[keyToVerify], seller: sellerEmail, email: req.user.email });
        }
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

const verifierVerifyRecord = async (req, res) => {
    try {
        // Get key, sellerEmail
        const { key, sellerEmail } = req.body;
        // Keys
        const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];
        // Check userType, key, buyerEmail
        if (req.user.userType !== "v" || !key || _.indexOf(keys, key) < 0 || !sellerEmail) {
            throw new Error();
        }

        // Get seller
        const seller = await User.findOne({ email: sellerEmail, userType: "s", isActive: true });
        // Check seller
        if (!seller) {
            throw new Error(404);
        }

        // Get sellerData
        const sellerData = await UserData.findOne({ _creator: seller._id });
        // Check sellerData
        if (!sellerData) {
            throw new Error(404);
        }

        // Get sellerRecord
        const sellerRecord = await Record.findOne({ _creator: seller._id });
        // Check sellerRecord
        if (!sellerRecord) {
            throw new Error(404);
        }

        // Get verifierData
        const verifierData = await UserData.findOne({ _creator: req.user._id });
        // Check verifierData
        if (!verifierData) {
            throw new Error(404);
        }

        // Get verifierRecord
        const verifierRecord = await Record.findOne({ _creator: req.user._id });
        // Check verifierRecord
        if (!verifierRecord) {
            throw new Error(404);
        }

        // Create verifierToken
        const verifierToken = verifierRecord.generateOwnerToken(req.user);

        // Count
        let count = 0;
        // Check sellerRecord array
        sellerRecord[key].forEach((record) => {
            // Check if verified
            if (record.verifier.length === 0) {
                // Update sellerRecord
                record.verifier.push({
                    email: req.user.email,
                    sign: verifierToken
                });

                // Update verifierRecord
                verifierRecord[key].push(record);

                // Update count
                count += 1;
            }
        });

        // Check count
        if (count === 0) {
            throw new Error();
        } else {
            // Update the sellerRecord log
            sellerRecord.log.push({
                action: `VERIFY:VERIFIER${req.user._id}:VERIFIER_RECORD${verifierRecord._id}:SELLER${seller._id}:SELLER_RECORD${sellerRecord._id}:DATE${new Date().getTime().toString()}`,
                body: { key, count },
                createdAt: new Date().getTime()
            });

            // Update the verifierRecord log
            verifierRecord.log.push({
                action: `VERIFY:SELLER${seller._id}:SELLER_RECORD${sellerRecord._id}:VERIFIER${req.user._id}:VERIFIER_RECORD${verifierRecord._id}:DATE${new Date().getTime().toString()}`,
                body: { key, count },
                createdAt: new Date().getTime()
            });

            // Patch sellerRecord
            await Record.updateOne(
                { _creator: seller._id },
                { $set: sellerRecord }
            );

            // Patch verifierRecord
            await Record.updateOne(
                { _creator: req.user._id },
                { $set: verifierRecord }
            );

            // Set message
            const message = [{
                action: "VERIFY",
                body: { key, count },
                from: req.user.email,
                time: new Date().getTime()
            },
            {
                action: "VERIFY",
                body: { key, count },
                to: sellerEmail,
                time: new Date().getTime()
            }];

            // Patch sellerData
            await UserData.updateOne(
                { _creator: seller._id },
                { $push: { "message.received": message[0] } }
            );

            // Patch verifierData
            await UserData.updateOne(
                { _creator: req.user._id },
                { $push: { "message.sent": message[1] } }
            );
        }

        // Send JSON body
        res.json({ message: `${count} ${key} verified successfully`, count, email: req.user.email });
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

module.exports = { sellerVerifyRecord, verifierGetRecord, verifierVerifyRecord };
