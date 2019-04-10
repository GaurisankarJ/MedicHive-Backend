// Lodash
const _ = require("lodash");

// UserData Model
const { UserData } = require("../../../models/userData.js");

const updateUserData = async (req, res) => {
    try {
        // Get key, value from request body
        const { key, value } = req.body;
        // Common keys
        const keys = ["name", "address"];
        // Buyer keys
        const buyerKeys = ["bio"];
        // Seller keys
        const sellerKeys = ["age", "weight", "sex", "occupation"];
        // Verifier keys
        const verifierKeys = ["bio"];
        // Check key and value
        if (!key || (_.indexOf(keys, key) < 0 && _.indexOf(sellerKeys, key) < 0 && _.indexOf(buyerKeys, key) < 0 && _.indexOf(verifierKeys, key) < 0) || !value) {
            throw new Error();
        }

        // Get userData
        const userData = await UserData.findOne({ _creator: req.user._id });
        // Check userData
        if (!userData) {
            throw new Error(404);
        }

        // Check userType
        if (req.user.userType === "b") {
            // Check key to update (against keys, buyerKeys)
            if (_.indexOf(keys, key) >= 0) {
                // Update the userData body
                userData[key] = value;
            } else if (_.indexOf(buyerKeys, key) >= 0) {
                // Update the userData.buyer body
                userData.buyer[key] = value;
            } else {
                throw new Error();
            }
        } else if (req.user.userType === "s") {
            // Check key to update (against keys, sellerKeys)
            if (_.indexOf(keys, key) >= 0) {
                // Update the userData body
                userData[key] = value;
            } else if (_.indexOf(sellerKeys, key) >= 0) {
                // Update the userData.sellers body
                userData.seller[key] = value;
            } else {
                throw new Error();
            }
        } else if (req.user.userType === "v") {
            // Check key to update (against keys, verifierKeys)
            if (_.indexOf(keys, key) >= 0) {
                // Update the userData body
                userData[key] = value;
            } else if (_.indexOf(verifierKeys, key) >= 0) {
                // Update the userData.verifier body
                userData.verifier[key] = value;
            } else {
                throw new Error();
            }
        }

        // Update userData
        await UserData.updateOne(
            { _creator: req.user._id },
            { $set: userData }
        );

        // Send JSON body
        res.json({ message: `${key} updated`, email: req.user.email });
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

module.exports = { updateUserData };
