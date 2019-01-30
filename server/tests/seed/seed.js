const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Record } = require("./../../models/record");
const { User } = require("./../../models/user");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
    {
        "_id": userOneId,
        "email": "sankar@example.com",
        "password": "userOnePass",
        "tokens": [{
            "access": "auth",
            "token": jwt.sign({ _id: userOneId.toHexString(), access: "auth" }, process.env.JWT_SECRET).toString()
        }]
    },
    {
        "_id": userTwoId,
        "email": "sankar1@example.com",
        "password": "userTwoPass",
        "tokens": [{
            "access": "auth",
            "token": jwt.sign({ _id: userTwoId.toHexString(), access: "auth" }, process.env.JWT_SECRET).toString()
        }]
    }
];

const records = [
    {
        _id: new ObjectID(),
        disease: "Disease",
        medication: "Medication",
        doctor: "Doctor",
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        disease: "Disease",
        medication: "Medication",
        doctor: "Doctor",
        _creator: userTwoId,
        completedAt: "Today"
    }
];

//To clear and repopulate database before every test
const populateRecords = (done) => {
    Record.deleteMany({}).then(() => {
        return Record.insertMany(records);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        //insertMany won't run the middleware
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        //Wait for all promises mentioned in array to be resolved
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = { records, populateRecords, users, populateUsers };
