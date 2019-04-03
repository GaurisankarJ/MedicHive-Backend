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

const verifyRecordSeller = async (req, res) => {
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
            time: new Date().getTime().toString()
        },
        {
            action: "VERIFY",
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

const getRecordVerifier = async (req, res) => {
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
            const seller = await User.findOne({ email: sellerEmail });
            // Check seller
            if (!seller || !seller.isActive) {
                throw new Error(404);
            }

            // Get sellerRecord
            const sellerRecord = await Record.findOne({ _creator: seller._id });
            // Check sellerRecord
            if (!sellerRecord) {
                throw new Error(404);
            }
            // Filter sellerRecord
            sellerRecord[keyToVerify] = sellerRecord[keyToVerify].filter(record => !record.isVerified);

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

const verifyRecordVerifier = async (req, res) => {
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
        const seller = await User.findOne({ email: sellerEmail, userType: "s" });
        // Check seller
        if (!seller || !seller.isActive) {
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

        // Create ownerToken
        const ownerToken = sellerRecord.generateOwnerToken(seller);

        // Create verifierToken
        const verifierToken = verifierRecord.generateOwnerToken(req.user);

        // Count
        let count = 0;
        // Check sellerRecord array
        sellerRecord[key].forEach((record) => {
            // Check isVerified
            if (!record.isVerified) {
                // Update isVerified body
                record.isVerified = true;

                // Update owner
                record.owner[0] = ownerToken;

                // Update verifier
                record.verifier.push(verifierToken);

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
                event: `GET:VERIFIER${req.user._id}:VERIFIER_REC${verifierRecord._id}:SELLER${seller._id}:SELLER_REC${sellerRecord._id}:DATE${new Date().getTime().toString()}`,
                data: `VERIFIED:${key}:${count}`,
                enteredAt: new Date().toUTCString()
            });

            // Update the verifierRecord log
            verifierRecord.log.push({
                event: `POST:SELLER${seller._id}:SELLER_REC${sellerRecord._id}:VERIFIER${req.user._id}:VERIFIER_REC${verifierRecord._id}:DATE${new Date().getTime().toString()}`,
                data: `VERIFY:${key}:${count}`,
                enteredAt: new Date().toUTCString()
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
                action: "VERIFIED",
                body: { key, count },
                from: req.user.email,
                time: new Date().getTime().toString()
            },
            {
                action: "VERIFIED",
                body: { key, count },
                to: sellerEmail,
                time: new Date().getTime().toString()
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

module.exports = { verifyRecordSeller, getRecordVerifier, verifyRecordVerifier };
