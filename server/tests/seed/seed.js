const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { User } = require("./../../models/user");
const { UserDetails } = require("../../models/user-details");
const { Record } = require("./../../models/record");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();
const users = [
    {
        _id: userOneId,
        email: "seller@example.com",
        password: "userOnePass",
        isActive: false,
        userType: "s",
        confirmation: [{
            secret: jwt.sign({ _id: userOneId.toHexString(), access: "s-auth" }, process.env.USER_SECRET).toString()
        }],
        tokens: [{
            access: "s-auth",
            token: jwt.sign({ _id: userOneId.toHexString(), access: "s-auth" }, process.env.JWT_SECRET).toString()
        }]
    },
    {
        _id: userTwoId,
        email: "buyer@example.com",
        password: "userTwoPass",
        isActive: false,
        userType: "b",
        confirmation: [{
            secret: jwt.sign({ _id: userTwoId.toHexString(), access: "b-auth" }, process.env.USER_SECRET).toString()
        }],
        tokens: [{
            access: "b-auth",
            token: jwt.sign({ _id: userTwoId.toHexString(), access: "b-auth" }, process.env.JWT_SECRET).toString()
        }]
    },
    {
        _id: userThreeId,
        email: "verifier@example.com",
        password: "userThreePassword",
        isActive: false,
        userType: "v",
        confirmation: [{
            secret: jwt.sign({ _id: userThreeId.toHexString(), access: "v-auth" }, process.env.USER_SECRET).toString()
        }],
        tokens: [{
            access: "v-auth",
            token: jwt.sign({ _id: userThreeId.toHexString(), access: "v-auth" }, process.env.JWT_SECRET).toString()
        }]
    }
];

const userDetailsIdOne = new ObjectID();
const userDetailsIdTwo = new ObjectID();
const userDetailsIdThree = new ObjectID();
const userDetails = [
    {
        _id: userDetailsIdOne,
        name: "SELLER",
        address: "Seller Address",
        seller: {
            age: 22,
            weight: 100,
            sex: "male",
            occupation: "job"
        },
        _creator: userOneId
    },
    {
        _id: userDetailsIdTwo,
        name: "BUYER",
        address: "Buyer Address",
        _creator: userTwoId
    },
    {
        _id: userDetailsIdThree,
        name: "VERIFIER",
        address: "Verifier Address",
        _creator: userThreeId
    }
];

const recordIdOne = new ObjectID();
const recordIdTwo = new ObjectID();
const recordIdThree = new ObjectID();
const records = [
    {
        _id: recordIdOne,
        allergy: [
            {
                data: "Allergy",
                owner: userOneId
            }
        ],
        medication: [
            {
                data: "Medication",
                owner: userOneId
            }
        ],
        problem: [
            {
                data: "Problem",
                owner: userOneId
            }
        ],
        immunization: [
            {
                data: "Immunization",
                owner: userOneId
            }
        ],
        vital_sign: [
            {
                data: "Vital Sign",
                owner: userOneId
            }
        ],
        procedure: [
            {
                data: "Procedure",
                owner: userOneId
            }
        ],
        log: [
            {
                event: "GENESIS",
                data: "GENESIS",
                enteredAt: new Date().toUTCString()
            }
        ],
        _creator: userOneId
    },
    {
        _id: recordIdTwo,
        log: [
            {
                event: "GENESIS",
                data: "GENESIS",
                enteredAt: new Date().toUTCString()
            }
        ],
        _creator: userTwoId
    },
    {
        _id: recordIdThree,
        allergy: [
            {
                data: "Allergy",
                owner: userThreeId
            }
        ],
        medication: [
            {
                data: "Medication",
                owner: userThreeId
            }
        ],
        problem: [
            {
                data: "Problem",
                owner: userThreeId
            }
        ],
        immunization: [
            {
                data: "Immunization",
                owner: userThreeId
            }
        ],
        vital_sign: [
            {
                data: "Vital Sign",
                owner: userThreeId
            }
        ],
        procedure: [
            {
                data: "Procedure",
                owner: userThreeId
            }
        ],
        log: [
            {
                event: "GENESIS",
                data: "GENESIS",
                enteredAt: new Date().toUTCString()
            }
        ],
        _creator: userThreeId
    }
];

// To clear and repopulate User database before every test
const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        // insertMany won't run the middleware
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();
        const userThree = new User(users[2]).save();

        // Wait for all promises mentioned in array to be resolved
        return Promise.all([userOne, userTwo, userThree]);
    }).then(() => done());
};

// To clear and repopulate UserDetails database before every test
const populateUserDetails = (done) => {
    UserDetails.deleteMany({}).then(() => {
        const userDetailsOne = new UserDetails(userDetails[0]).save();
        const userDetailsTwo = new UserDetails(userDetails[1]).save();
        const userDetailsThree = new UserDetails(userDetails[2]).save();

        return Promise.all([userDetailsOne, userDetailsTwo, userDetailsThree]);
    }).then(() => done());
};

// To clear UserDetails
const deleteUserDetails = (done) => {
    UserDetails.deleteMany({}).then(() => {
        return Promise.resolve();
    }).then(() => done());
};

// To clear and repopulate Record database before every test
const populateRecords = (done) => {
    Record.deleteMany({}).then(() => {
        return Record.insertMany(records);
    }).then(() => done());
};

// To clear Record
const deleteRecords = (done) => {
    Record.deleteMany({}).then(() => {
        return Promise.resolve();
    }).then(() => done());
};

module.exports = {
    users,
    populateUsers,
    userDetails,
    populateUserDetails,
    deleteUserDetails,
    records,
    populateRecords,
    deleteRecords
};
