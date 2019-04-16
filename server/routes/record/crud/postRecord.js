// Record Model
const { Record } = require("../../../models/record.js");

const postRecord = async (req, res) => {
    try {
        // Create body object
        const body = {
            log: [{
                action: `GENESIS:USER${req.user._id}:DATE${new Date().getTime().toString()}`,
                body: { userType: req.user.userType },
                createdAt: new Date().getTime()
            }],
            _creator: req.user._id
        };

        // Create instance of Record model
        const record = new Record(body);
        // Save record instance
        await record.save();

        // Send JSON body
        res.json({ message: "record created", email: req.user.email });
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { postRecord };
