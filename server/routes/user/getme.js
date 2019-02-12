const _ = require("lodash");

const { UserDetails } = require("../../models/user_details.js");

const userGetMe = async (req, res) => {
    try {
        let userDetails = await UserDetails.find({ _creator: req.user._id });
        if (_.isEmpty(userDetails)) {
            res.status(404).send();
        }
        userDetails = _.pick(userDetails[0], ["age", "weight", "sex", "occupation", "address"]);

        res.send({ user: req.user._id, userDetails });
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        res.status(400).send();
    }
};

module.exports = { userGetMe };
