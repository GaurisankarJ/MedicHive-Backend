const _ = require("lodash");

const { UserDetails } = require("../../../models/user_details.js");

const userGetMe = async (req, res) => {
    try {
        let userDetails = await UserDetails.find({ _creator: req.user._id });
        if (_.isEmpty(userDetails)) {
            throw new Error(404);
        }
        userDetails = _.pick(userDetails[0], ["age", "weight", "sex", "occupation", "address"]);

        res.send({ user: req.user._id, userDetails });
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        if (err.message === "404") {
            res.status(404).send();
        }
        res.status(400).send();
    }
};

module.exports = { userGetMe };
