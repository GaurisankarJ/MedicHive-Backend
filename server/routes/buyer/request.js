// Lodash
const _ = require("lodash");

// UserData Model
const { UserData } = require("../../models/userData.js");

const requestDataBuyer = async (req, res) => {
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
            action: "REQUEST",
            body: {
                key
            },
            from: req.user.email
        },
        {
            action: "REQUEST",
            body: {
                key
            }
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
        res.json({ message: "data requested successfully", email: req.user.email });
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

module.exports = { requestDataBuyer };
