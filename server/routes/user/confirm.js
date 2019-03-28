// Send confirmation mail
const { sendConfirmationMail } = require("../../utils/mail.js");

// User Model
const { User } = require("../../models/user.js");

const userConfirmSend = async (req, res) => {
    try {
        // Generate confirmation secret
        const secret = await req.user.generateConfirmationSecret();

        // Send confirmation mail synchronously
        await sendConfirmationMail(req.user.email, secret);

        // Send JSON body
        res.json({ message: "confirmation mail sent successfully", email: req.user.email });
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Bad Request
        res.status(400).send();
    }
};

const userConfirmMe = async (req, res) => {
    try {
        // Get secret from params body
        const { secret } = req.params;
        // Check secret
        if (!secret) {
            throw new Error();
        }

        // Get user
        const user = await User.findBySecret(secret);

        // Patch userType
        await User.updateOne(
            { _id: user._id },
            { $set: { isActive: true } }
        );

        // Redirect to home
        res.redirect(process.env.HOME_PAGE);
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { userConfirmSend, userConfirmMe };
