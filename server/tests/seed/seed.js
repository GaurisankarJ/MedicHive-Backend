const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { User } = require("./../../models/user");
const { UserDetails } = require("./../../models/user_details");
const { Record } = require("./../../models/record");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
    {
        _id: userOneId,
        email: "sankar@example.com",
        password: "userOnePass",
        tokens: [{
            access: "auth",
            token: jwt.sign({ _id: userOneId.toHexString(), access: "auth" }, process.env.JWT_SECRET).toString()
        }]
    },
    {
        _id: userTwoId,
        email: "sankar1@example.com",
        password: "userTwoPass",
        tokens: [{
            access: "auth",
            token: jwt.sign({ _id: userTwoId.toHexString(), access: "auth" }, process.env.JWT_SECRET).toString()
        }]
    }
];

const userDetails = [
    {
        age: 22,
        weight: 100,
        sex: "male"
    },
    {
        age: 23,
        weight: 101,
        sex: "female",
        occupation: "job",
        address: "North Pole",
        _creator: userTwoId
    }
];

const records = [
    {
        _id: new ObjectID(),
        allergy: "Allergy",
        medication: "Medication",
        problem: "Problem",
        immunization: "Immunization",
        vital_sign: "Vital Sign",
        procedure: "Procedure",
        log: "LOG",
        _creator: userOneId
    }
];

// To clear and repopulate database before every test
const populateRecords = (done) => {
    Record.deleteMany({}).then(() => {
        return Record.insertMany(records);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        // insertMany won't run the middleware
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        // Wait for all promises mentioned in array to be resolved
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

const populateUserDetails = (done) => {
    UserDetails.deleteMany({}).then(() => {
        const userDetailsTwo = new UserDetails(userDetails[1]).save();

        return Promise.all([userDetailsTwo]);
    }).then(() => done());
};

module.exports = {
    users,
    populateUsers,
    userDetails,
    populateUserDetails,
    records,
    populateRecords
};
