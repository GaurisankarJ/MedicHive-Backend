const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const cors = require("cors");

require("./config/config.js");
const { mongoose, ObjectID } = require("./db/mongoose.js");
const { User } = require("./models/user.js");
const { Record } = require("./models/record.js");
const { authenticate } = require("./middleware/authenticate.js");

const app = express();
const port = process.env.PORT;

const corsOptions = {
    exposedHeaders: ["x-auth"]
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/users", (req, res) => { 
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);
    
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header("x-auth", token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.post("/users/login", (req, res) => {
    var body = _.pick(req.body, ["email", "password"]);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header("x-auth", token).send(user);
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete("/users/me/token", authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send("Token Deleted!");
    }, () => {
        res.status(400).send(err);
    });
});

app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user);
});

app.post("/records", authenticate, (req, res) => {
    var record = new Record({
        disease: req.body.disease,
        medication: req.body.medication,
        doctor: req.body.doctor,
        enteredAt: new Date().toString(),
        _creator: req.user._id
    });
    record.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get("/records", authenticate, (req, res) => {
    Record.find({ _creator: req.user._id }).then((records) => {
        res.send({ records });
    }, (err) => {
        res.status(400).send(err);
    });
});


app.delete("/records/:id", authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send("Invalid ID!");
    }
    Record.findOneAndDelete({ _id: id, _creator: req.user._id }).then((record) => {
        if(!record) {
            res.status(404).send("User not found!");
        }
        res.status(200).send({ record });
    }).catch((err) => {
        res.status(400).send();
    });
});

app.patch("/records/:id", authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ["disease", "medication", "doctor", "enteredAt"]);
    body.enteredAt = new Date().toString();

    if(!ObjectID.isValid(id)) {
        return res.status(404).send("Invalid ID!");
    }
    Record.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new:true }).then((record) => {
        if(!record) {
            res.status(404).send("User not found!");
        }
        res.status(200).send({ record });
    }).catch((err) => {
        res.status(400).send();
    });
});

var listener = app.listen(port, () => {
    console.log(`Server running on port ${listener.address().port}!`);
});

module.exports = { app };