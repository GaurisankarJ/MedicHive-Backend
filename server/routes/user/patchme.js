const _ = require("lodash");

const { UserDetails } = require("../../models/user_details.js");

const userPatchMe = async (req, res) => {
    try {
        const body = _.pick(req.body, ["age", "weight", "sex", "occupation", "address"]);
        body.enteredAt = new Date().toString();

        const user = await UserDetails.findOneAndUpdate(
            { _creator: req.user._id },
            { $set: body },
            { new: true }
        );
        if (!user) {
            res.status(404).send();
        }

        res.send(user._creator);
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        res.status(400).send();
    }
};

module.exports = { userPatchMe };
