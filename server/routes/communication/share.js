// Lodash
const _ = require("lodash");

// User Model
const { User } = require("../../models/user.js");
// UserData Model
const { UserData } = require("../../models/userData.js");
// Record Model
const { Record } = require("../../models/record.js");

const sellerShareRecord = async (req, res) => {
    try {
        // Get key, buyerEmail
        const { key, buyerEmail } = req.body;
        // Keys
        const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];
        // Check userType, key, buyerEmail
        if (req.user.userType !== "s" || !key || _.indexOf(keys, key) < 0 || !buyerEmail) {
            throw new Error();
        }

        // Get buyer
        const buyer = await User.findOne({ email: buyerEmail, userType: "b" });
        // Check buyer
        if (!buyer || !buyer.isActive) {
            throw new Error(404);
        }

        // Get buyerData
        const buyerData = await UserData.findOne({ _creator: buyer._id });
        // Check buyerData
        if (!buyerData) {
            throw new Error(404);
        }

        // Get buyerRecord
        const buyerRecord = await Record.findOne({ _creator: buyer._id });
        // Check buyerRecord
        if (!buyerRecord) {
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

        // Get sellerRecords from seller
        const sellerRecords = sellerRecord.findByOwnerRecords(req.user._id, key);

        // Create ownerToken
        const ownerToken = buyerRecord.generateOwnerToken(buyer);

        // Count
        let count = 0;
        // Check sellerRecords
        sellerRecords.forEach((record) => {
            // Check record
            if (!_.find(buyerRecord[key], { _id: record._id })) {
                // Update owner
                record.owner.push(ownerToken);

                // Update buyerRecord body
                buyerRecord[key].push(record);

                // Update count
                count += 1;
            }
        });

        // Check count
        if (count === 0) {
            throw new Error();
        } else {
            // Update the buyerRecord log
            buyerRecord.log.push({
                event: `GET:SELLER${req.user._id}:SELLER_REC${sellerRecord._id}:BUYER${buyer._id}:BUYER_REC${buyerRecord._id}:DATE${new Date().getTime().toString()}`,
                data: `RECEIVED:${key}:${count}`,
                enteredAt: new Date().toUTCString()
            });

            // Update the sellerRecord log
            sellerRecord.log.push({
                event: `POST:BUYER${buyer._id}:BUYER_REC${buyerRecord._id}:SELLER${req.user._id}:SELLER_REC${sellerRecord._id}:DATE${new Date().getTime().toString()}`,
                data: `SENT:${key}:${count}`,
                enteredAt: new Date().toUTCString()
            });

            // Patch buyerRecord
            await Record.updateOne(
                { _creator: buyer._id },
                { $set: buyerRecord }
            );

            // Patch sellerRecord
            await Record.updateOne(
                { _creator: req.user._id },
                { $set: sellerRecord }
            );

            // Set messages
            const message = [{
                action: "RECEIVED",
                body: {
                    key, count
                },
                from: req.user.email,
                time: new Date().getTime().toString()
            },
            {
                action: "SENT",
                body: {
                    key, count
                },
                to: buyerEmail,
                time: new Date().getTime().toString()
            }];

            // Patch buyerData
            await UserData.updateOne(
                { _creator: buyer._id },
                { $push: { "message.received": message[0] } }
            );

            // Patch sellerData
            await UserData.updateOne(
                { _creator: req.user._id },
                { $push: { "message.sent": message[1] } }
            );
        }

        // Send JSON body
        res.json({ message: `${count} ${key} shared successfully`, count, email: req.user.email });
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

const verifierShareRecord = async (req, res) => {
    try {
        // Get key, sellerEmail
        const { key, sellerEmail } = req.body;
        // Keys
        const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];
        // Check userType, key, sellerEmail
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

        // Get verifierRecords from verifier
        const verifierRecords = verifierRecord.findByOwnerRecords(seller._id, key);

        // Create ownerToken
        const ownerToken = sellerRecord.generateOwnerToken(seller);

        // Count
        let count = 0;
        // Check verifierRecords array
        verifierRecords.forEach((record) => {
            // Check record
            if (!_.find(sellerRecord[key], { _id: record._id })) {
                // Update owner
                record.owner[0] = ownerToken;

                // Update sellerRecord body
                sellerRecord[key].push(record);

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
                data: `RECEIVED:${key}:${count}`,
                enteredAt: new Date().toUTCString()
            });

            // Update the verifierRecord log
            verifierRecord.log.push({
                event: `POST:SELLER${seller._id}:SELLER_REC${sellerRecord._id}:VERIFIER${req.user._id}:VERIFIER_REC${verifierRecord._id}:DATE${new Date().getTime().toString()}`,
                data: `SENT:${key}:${count}`,
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

            // Set messages
            const message = [{
                action: "RECEIVED",
                body: { key, count },
                from: req.user.email,
                time: new Date().getTime().toString()
            },
            {
                action: "SENT",
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
        res.json({ message: `${count} ${key} shared successfully`, count, email: req.user.email });
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


module.exports = { sellerShareRecord, verifierShareRecord };
