// Lodash
const _ = require("lodash");

// User Model
const { User } = require("../../models/user.js");
// UserData Model
const { UserData } = require("../../models/userData.js");
// Record Model
const { Record } = require("../../models/record.js");

const shareDataSeller = async (req, res) => {
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
        const buyer = await User.findOne({ email: buyerEmail });
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

        // Get sellerDate
        const sellerData = await UserData.findOne({ _creator: buyer._id });
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

        // Count
        let count = 0;
        // Check sellerRecord[key] array
        sellerRecord[key].forEach((record) => {
            if (record.isVerified) {
                // Update the buyerRecord body
                buyerRecord[key].push(record);

                // Update count
                count += 1;
            }
        });

        // Update the buyerRecord log
        buyerRecord.log.push({
            event: `GET:SELLER${req.user._id}:SELLER_REC${sellerRecord._id}:BUYER${buyer._id}:BUYER_REC${buyerRecord._id}:DATE${new Date().getTime().toString()}`,
            data: `RECEIVED:${key}:${count}`,
            enteredAt: new Date().toUTCString()
        });

        // Update the sellerRecord log
        sellerRecord.log.push({
            event: `POST:BUYER${buyer._id}:BUYER_REC${buyerRecord._id}:SELLER${req.user._id}:SELLER_REC${sellerRecord._id}:DATE${new Date().getTime().toString()}`,
            data: `SHARED:${key}:${count}`,
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

        // Set message
        const message = [{
            action: "RECEIVED",
            body: {
                key, buyerEmail, count
            },
            from: req.user.email
        },
        {
            action: "SHARED",
            body: {
                key, buyerEmail, count
            }
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

        // Send JSON body
        res.json({ message: `${count} records shared successfully`, count, email: req.user.email });
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


module.exports = { shareDataSeller };
