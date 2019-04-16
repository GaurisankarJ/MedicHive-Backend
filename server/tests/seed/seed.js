// ObjectID MongoDB
const { ObjectID } = require("mongodb");
// JSON Web Token Middleware
const jwt = require("jsonwebtoken");

// User Model
const { User } = require("./../../models/user");
// UserData Model
const { UserData } = require("../../models/userData");
// Record Model
const { Record } = require("./../../models/record");

// *******************************************************************
// ###################################################################
// USER
// ###################################################################
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();
const users = [
    {
        _id: userOneId,
        email: "seller@example.com",
        password: "userOnePass",
        isActive: true,
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
        isActive: true,
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
        isActive: true,
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

// TO CLEAR "users"
const deleteUsers = (done) => {
    User.deleteMany({}).then(() => {
        return Promise.resolve();
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "users"
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

// TO CLEAR AND REPOPULATE "users" with just "seller"
const populateSeller = (done) => {
    User.deleteMany({}).then(() => {
        const userOne = new User(users[0]).save();

        return Promise.all([userOne]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "users" with just "buyer"
const populateBuyer = (done) => {
    User.deleteMany({}).then(() => {
        const userTwo = new User(users[1]).save();

        return Promise.all([userTwo]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "users" with just "verifier"
const populateVerifier = (done) => {
    User.deleteMany({}).then(() => {
        const userThree = new User(users[2]).save();

        return Promise.all([userThree]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "users" with activated "users"
const populateActivatedUsers = (done) => {
    User.deleteMany({}).then(() => {
        users.forEach((user) => {
            user.isActive = true;
        });

        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();
        const userThree = new User(users[2]).save();

        return Promise.all([userOne, userTwo, userThree]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "users" with deactivated "users"
const populateDeactivatedUsers = (done) => {
    User.deleteMany({}).then(() => {
        users.forEach((user) => {
            user.isActive = false;
        });

        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();
        const userThree = new User(users[2]).save();

        return Promise.all([userOne, userTwo, userThree]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "users" with activated "seller"
const populateActivatedSeller = (done) => {
    User.deleteMany({}).then(() => {
        users[0].isActive = true;
        users[1].isActive = false;
        users[2].isActive = false;

        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();
        const userThree = new User(users[2]).save();

        return Promise.all([userOne, userTwo, userThree]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "users" with activated "buyer"
const populateActivatedBuyer = (done) => {
    User.deleteMany({}).then(() => {
        users[0].isActive = false;
        users[1].isActive = true;
        users[2].isActive = false;

        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();
        const userThree = new User(users[2]).save();

        return Promise.all([userOne, userTwo, userThree]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "users" with activated "verifier"
const populateActivatedVerifier = (done) => {
    User.deleteMany({}).then(() => {
        users[0].isActive = false;
        users[1].isActive = false;
        users[2].isActive = true;

        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();
        const userThree = new User(users[2]).save();

        return Promise.all([userOne, userTwo, userThree]);
    }).then(() => done());
};
// ###################################################################
// *******************************************************************

// *******************************************************************
// ###################################################################
// USER Data
// ###################################################################
const userDataIdOne = new ObjectID();
const userDataIdTwo = new ObjectID();
const userDataIdThree = new ObjectID();
const messageSentId = new ObjectID();
const messageReceivedId = new ObjectID();

const userData = [
    {
        _id: userDataIdOne,
        name: "SELLER",
        address: "Seller Address",
        message: {
            sent: [
                {
                    _id: messageSentId,
                    action: "VERIFY",
                    body: { key: "allergy" },
                    to: users[2].email,
                    time: 100
                }
            ]
        },
        userType: "s",
        seller: {
            age: 22,
            weight: 100,
            sex: "male",
            occupation: "job"
        },
        _creator: userOneId
    },
    {
        _id: userDataIdTwo,
        name: "BUYER",
        address: "Buyer Address",
        userType: "b",
        _creator: userTwoId
    },
    {
        _id: userDataIdThree,
        name: "VERIFIER",
        address: "Verifier Address",
        message: {
            received: [
                {
                    _id: messageReceivedId,
                    action: "VERIFY",
                    body: { key: "allergy" },
                    from: users[0].email,
                    time: 100
                }
            ]
        },
        userType: "v",
        _creator: userThreeId
    }
];

// TO CLEAR "userdatas"
const deleteUserData = (done) => {
    UserData.deleteMany({}).then(() => {
        return Promise.resolve();
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "userdatas"
const populateUserData = (done) => {
    UserData.deleteMany({}).then(() => {
        const userDataOne = new UserData(userData[0]).save();
        const userDataTwo = new UserData(userData[1]).save();
        const userDataThree = new UserData(userData[2]).save();

        return Promise.all([userDataOne, userDataTwo, userDataThree]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "userdatas" with just "seller"
const populateSellerData = (done) => {
    UserData.deleteMany({}).then(() => {
        const userDataOne = new UserData(userData[0]).save();

        return Promise.all([userDataOne]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "userdatas" with just "buyer"
const populateBuyerData = (done) => {
    UserData.deleteMany({}).then(() => {
        const userDataTwo = new UserData(userData[1]).save();

        return Promise.all([userDataTwo]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "userdatas" with just "verifier"
const populateVerifierData = (done) => {
    UserData.deleteMany({}).then(() => {
        const userDataThree = new UserData(userData[2]).save();

        return Promise.all([userDataThree]);
    }).then(() => done());
};
// ###################################################################
// *******************************************************************

// *******************************************************************
// ###################################################################
// RECORD
// ###################################################################
const recordOneId = new ObjectID();
const recordTwoId = new ObjectID();
const recordThreeId = new ObjectID();
// Sign tokens
const signToken = (userId, recordId) => {
    // Generate token
    const token = jwt.sign(
        {
            owner: userId.toHexString(),
            record: recordId.toHexString(),
            time: new Date(100).getTime()
        },
        process.env.USER_SECRET
    );

    // Return token
    return token;
};
const records = [
    {
        _id: recordOneId,
        allergy: [
            {
                _id: new ObjectID(),
                data: "Allergy Seller",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        medication: [
            {
                _id: new ObjectID(),
                data: "Medication Seller",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        problem: [
            {
                _id: new ObjectID(),
                data: "Problem Seller",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        immunization: [
            {
                _id: new ObjectID(),
                data: "Immunization Seller",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        vital_sign: [
            {
                _id: new ObjectID(),
                data: "Vital Sign Seller",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        procedure: [
            {
                _id: new ObjectID(),
                data: "Procedure Seller",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        log: [
            {
                action: `GENESIS:USER${users[0]._id}:DATE${new Date(100).getTime().toString()}`,
                body: {
                    userType: users[0].userType
                },
                createdAt: new Date(100).getTime()
            }
        ],
        _creator: userOneId
    },
    {
        _id: recordTwoId,
        allergy: [
            {
                _id: new ObjectID(),
                data: "Allergy Buyer",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    },
                    {
                        email: users[1].email,
                        sign: signToken(userTwoId, recordTwoId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        medication: [
            {
                _id: new ObjectID(),
                data: "Medication Buyer",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    },
                    {
                        email: users[1].email,
                        sign: signToken(userTwoId, recordTwoId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        problem: [
            {
                _id: new ObjectID(),
                data: "Problem Buyer",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    },
                    {
                        email: users[1].email,
                        sign: signToken(userTwoId, recordTwoId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        immunization: [
            {
                _id: new ObjectID(),
                data: "Immunization Buyer",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    },
                    {
                        email: users[1].email,
                        sign: signToken(userTwoId, recordTwoId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        vital_sign: [
            {
                _id: new ObjectID(),
                data: "Vital Sign Buyer",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    },
                    {
                        email: users[1].email,
                        sign: signToken(userTwoId, recordTwoId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        procedure: [
            {
                _id: new ObjectID(),
                data: "Procedure Buyer",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    },
                    {
                        email: users[1].email,
                        sign: signToken(userTwoId, recordTwoId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        log: [
            {
                action: `GENESIS:USER${users[1]._id}:DATE${new Date(100).getTime().toString()}`,
                body: {
                    userType: users[1].userType
                },
                createdAt: new Date(100).getTime()
            }
        ],
        _creator: userTwoId
    },
    {
        _id: recordThreeId,
        allergy: [
            {
                _id: new ObjectID(),
                data: "Allergy Verifier",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        medication: [
            {
                _id: new ObjectID(),
                data: "Medication Verifier",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        problem: [
            {
                _id: new ObjectID(),
                data: "Problem Verifier",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        immunization: [
            {
                _id: new ObjectID(),
                data: "Immunization Verifier",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        vital_sign: [
            {
                _id: new ObjectID(),
                data: "Vital Sign Verifier",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        procedure: [
            {
                _id: new ObjectID(),
                data: "Procedure Verifier",
                owner: [
                    {
                        email: users[0].email,
                        sign: signToken(userOneId, recordOneId)
                    }
                ],
                verifier: [
                    {
                        email: users[2].email,
                        sign: signToken(userThreeId, recordThreeId)
                    }
                ],
                createdAt: new Date(100).getTime()
            }
        ],
        log: [
            {
                action: `GENESIS:USER${users[2]._id}:DATE${new Date(100).getTime().toString()}`,
                body: {
                    userType: users[2].userType
                },
                createdAt: new Date(100).getTime()
            }
        ],
        _creator: userThreeId
    }
];

// TO CLEAR "records"
const deleteRecords = (done) => {
    Record.deleteMany({}).then(() => {
        return Promise.resolve();
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "records"
const populateRecords = (done) => {
    Record.deleteMany({}).then(() => {
        return Record.insertMany(records);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "records" with verified "records"
const populateVerifiedRecords = (done) => {
    Record.deleteMany({}).then(() => {
        // Keys
        const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];

        // Verify record
        keys.forEach((key) => {
            records[0][key][0].verifier = [{
                email: users[2].email,
                sign: signToken(userThreeId, recordThreeId)
            }];
        });

        return Record.insertMany(records);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "records" with unverified "records"
const populateUnverifiedRecords = (done) => {
    Record.deleteMany({}).then(() => {
        // Keys
        const keys = ["allergy", "medication", "problem", "immunization", "vital_sign", "procedure"];

        // Invert record
        keys.forEach((key) => {
            records[0][key][0].verifier = [];
        });

        return Record.insertMany(records);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "records" with just "seller"
const populateSellerRecord = (done) => {
    Record.deleteMany({}).then(() => {
        const userRecordOne = new Record(records[0]).save();

        return Promise.all([userRecordOne]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "records" with just "buyer"
const populateBuyerRecord = (done) => {
    Record.deleteMany({}).then(() => {
        const userRecordTwo = new Record(records[1]).save();

        return Promise.all([userRecordTwo]);
    }).then(() => done());
};

// TO CLEAR AND REPOPULATE "records" with just "verifier"
const populateVerifierRecord = (done) => {
    Record.deleteMany({}).then(() => {
        const userRecordThree = new Record(records[2]).save();

        return Promise.all([userRecordThree]);
    }).then(() => done());
};
// ###################################################################
// *******************************************************************


module.exports = {
    users,
    deleteUsers,
    populateUsers,
    populateSeller,
    populateBuyer,
    populateVerifier,
    populateActivatedUsers,
    populateDeactivatedUsers,
    populateActivatedSeller,
    populateActivatedBuyer,
    populateActivatedVerifier,
    userData,
    deleteUserData,
    populateUserData,
    populateSellerData,
    populateBuyerData,
    populateVerifierData,
    records,
    deleteRecords,
    populateRecords,
    populateVerifiedRecords,
    populateUnverifiedRecords,
    populateSellerRecord,
    populateBuyerRecord,
    populateVerifierRecord
};
