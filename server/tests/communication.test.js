// Mocha Test Framework

// Testing with Jest, expect function
const expect = require("expect");
// Testing HTTP via superagent
const request = require("supertest");
// ObjectID
const { ObjectID } = require("mongodb");
// JSON Web Token Middleware
const jwt = require("jsonwebtoken");

// The app for testing
const { app } = require("./../server.js");
// UserData Model
const { UserData } = require("../models/userData.js");
// Record Model
const { Record } = require("../models/record.js");

// Seed Data
const { users, populateUsers, populateVerifier, populateActivatedUsers, populateActivatedSeller, populateActivatedVerifier, populateDeactivatedUsers, userData, deleteUserData, populateUserData, populateSellerData, populateBuyerData, populateVerifierData, records, deleteRecords, populateRecords, populateVerifiedRecords, populateSellerRecord, populateBuyerRecord, populateVerifierRecord, populateUnverifiedRecords } = require("./seed/seed");

// Testing life-cycle, beforeEach Hook
// Populating Users
beforeEach(populateUsers);
// Populating User Data
beforeEach(populateUserData);
// Populating Records
beforeEach(populateRecords);
// Testing life-cycle, after Hook
// Populating Users
after(populateActivatedUsers);
// Populating Records
after(populateVerifiedRecords);

describe("POST /request/b", () => {
    describe("POPULATED", () => {
        it("should request data if authenticated, activated", (done) => {
            const body = {
                key: "allergy"
            };

            request(app)
                .post("/request/b")
                .set("x-auth", users[1].tokens[0].token)
                .send(body)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe("allergy requested successfully");
                    expect(res.body.email).toBe(users[1].email);
                })
                .end((err) => {
                    if (err) {
                        done(err);
                    }

                    UserData.findOne({ _creator: users[1]._id.toHexString() }).then((buyerData) => {
                        expect(buyerData.message.sent.length).toBe(1);
                        expect(buyerData.message.sent[0].action).toBe("REQUEST");
                        expect(buyerData.message.sent[0].body.key).toBe(body.key);
                    }).catch(e => done(e));

                    done();
                });
        });

        it("should not request data if not authenticated", (done) => {
            const body = {
                key: "allergy"
            };

            request(app)
                .post("/request/b")
                .send(body)
                .expect(401)
                .end(done);
        });

        it("should not request data if invalid request (invalid userType)", (done) => {
            const body = {
                key: "allergy"
            };

            request(app)
                .post("/request/b")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not request data if invalid request (no key)", (done) => {
            const body = {
                one: "allergy"
            };

            request(app)
                .post("/request/b")
                .set("x-auth", users[1].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not request data if invalid request (invalid key)", (done) => {
            const body = {
                key: "none"
            };

            request(app)
                .post("/request/b")
                .set("x-auth", users[1].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });
    });

    describe("NOT ACTIVATED", () => {
        beforeEach(populateDeactivatedUsers);
        afterEach(populateActivatedUsers);

        it("should not share data if authenticated, not activated", (done) => {
            const body = {
                key: "allergy"
            };

            request(app)
                .post("/request/b")
                .set("x-auth", users[1].tokens[0].token)
                .send(body)
                .expect(401)
                .end(done);
        });
    });

    describe("EMPTY", () => {
        describe("DATA", () => {
            beforeEach(deleteUserData);

            it("should not request data if buyerData not in database", (done) => {
                const body = {
                    key: "allergy"
                };

                request(app)
                    .post("/request/b")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });
    });
});

describe("POST /request/s", () => {
    describe("POPULATED", () => {
        it("should request data if authenticated, activated", (done) => {
            const body = {
                key: "allergy",
                verifierEmail: users[2].email
            };

            request(app)
                .post("/request/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe("allergy requested successfully");
                    expect(res.body.email).toBe(users[0].email);
                })
                .end((err) => {
                    if (err) {
                        done(err);
                    }

                    UserData.findOne({ _creator: users[0]._id.toHexString() }).then((sellerData) => {
                        expect(sellerData.message.sent.length).toBe(2);
                        expect(sellerData.message.sent[1].action).toBe("REQUEST");
                        expect(sellerData.message.sent[1].body.key).toBe(body.key);
                        expect(sellerData.message.sent[1].to).toBe(body.verifierEmail);
                    }).catch(e => done(e));

                    UserData.findOne({ _creator: users[2]._id.toHexString() }).then((verifierData) => {
                        expect(verifierData.message.received.length).toBe(2);
                        expect(verifierData.message.received[1].action).toBe("REQUESTED");
                        expect(verifierData.message.received[1].body.key).toBe(body.key);
                        expect(verifierData.message.received[1].from).toBe(users[0].email);
                    }).catch(e => done(e));

                    done();
                });
        });

        it("should not request data if not authenticated", (done) => {
            const body = {
                key: "allergy",
                verifierEmail: users[2].email
            };

            request(app)
                .post("/request/s")
                .send(body)
                .expect(401)
                .end(done);
        });

        it("should not request data if invalid request (invalid userType)", (done) => {
            const body = {
                key: "allergy",
                verifierEmail: users[2].email
            };

            request(app)
                .post("/request/s")
                .set("x-auth", users[1].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not request data if invalid request (no key)", (done) => {
            const body = {
                one: "allergy",
                verifierEmail: users[2].email
            };

            request(app)
                .post("/request/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not request data if invalid request (invalid key)", (done) => {
            const body = {
                key: "none",
                verifierEmail: users[2].email
            };

            request(app)
                .post("/request/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not request data if invalid request (no verifierEmail)", (done) => {
            const body = {
                key: "none",
                two: "two"
            };

            request(app)
                .post("/request/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not request data if invalid request (unknown verifierEmail)", (done) => {
            const body = {
                key: "allergy",
                verifierEmail: "user@email.com"
            };

            request(app)
                .post("/request/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });

        it("should not request data if invalid request (invalid verifierEmail(userType))", (done) => {
            const body = {
                key: "allergy",
                verifierEmail: users[1].email
            };

            request(app)
                .post("/request/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });
    });

    describe("NOT ACTIVATED", () => {
        describe("SELLER", () => {
            beforeEach(populateDeactivatedUsers);

            it("should not share data if authenticated, not activated", (done) => {
                const body = {
                    key: "allergy",
                    verifierEmail: users[2].email
                };

                request(app)
                    .post("/request/s")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(401)
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            beforeEach(populateActivatedSeller);
            afterEach(populateActivatedUsers);

            it("should not share data if authenticated, not activated", (done) => {
                const body = {
                    key: "allergy",
                    verifierEmail: users[2].email
                };

                request(app)
                    .post("/request/s")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });
    });

    describe("EMPTY", () => {
        describe("VERIFIER", () => {
            describe("DATA", () => {
                beforeEach(deleteUserData);

                it("should not request data if verifierData not in database", (done) => {
                    const body = {
                        key: "allergy",
                        verifierEmail: users[2].email
                    };

                    request(app)
                        .post("/request/s")
                        .set("x-auth", users[0].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });
        });

        describe("SELLER", () => {
            describe("DATA", () => {
                beforeEach(populateVerifierData);

                it("should not request data if sellerData not in database", (done) => {
                    const body = {
                        key: "allergy",
                        verifierEmail: users[2].email
                    };

                    request(app)
                        .post("/request/s")
                        .set("x-auth", users[0].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });
        });
    });
});

describe("POST /share/s", () => {
    describe("POPULATED", () => {
        const shareRecord = (key) => {
            it(`should share ${key} if authenticated, activated, verified`, (done) => {
                const body = {
                    key,
                    buyerEmail: users[1].email
                };

                request(app)
                    .post("/share/s")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.message).toBe(`${res.body.count} ${key} shared successfully`);
                        expect(res.body.count).toBe(1);
                        expect(res.body.email).toBe(users[0].email);
                    })
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: users[0]._id.toHexString() }).then((sellerRecord) => {
                            expect(sellerRecord.log.length).toBe(2);

                            Record.findOne({ _creator: users[1]._id.toHexString() }).then((buyerRecord) => {
                                expect(buyerRecord[key][1].toObject()).toMatchObject(sellerRecord[key][0].toObject());
                                expect(buyerRecord.log.length).toBe(2);
                            }).catch(e => done(e));
                        }).catch(e => done(e));

                        UserData.findOne({ _creator: users[0]._id.toHexString() }).then((sellerData) => {
                            expect(sellerData.message.sent.length).toBe(2);
                            expect(sellerData.message.sent[1].action).toBe("SENT");
                            expect(sellerData.message.sent[1].body.key).toBe(body.key);
                            expect(sellerData.message.sent[1].body.count).toBe(1);
                        }).catch(e => done(e));

                        UserData.findOne({ _creator: users[1]._id.toHexString() }).then((buyerData) => {
                            expect(buyerData.message.received.length).toBe(1);
                            expect(buyerData.message.received[0].action).toBe("RECEIVED");
                            expect(buyerData.message.received[0].body.key).toBe(body.key);
                            expect(buyerData.message.received[0].body.count).toBe(1);
                            expect(buyerData.message.received[0].from).toBe(users[0].email);
                        }).catch(e => done(e));

                        done();
                    });
            });
        };

        shareRecord("allergy");

        shareRecord("medication");

        shareRecord("problem");

        shareRecord("immunization");

        shareRecord("vital_sign");

        shareRecord("procedure");

        it("should not share data if not authenticated", (done) => {
            const body = {
                key: "allergy",
                buyerEmail: users[1].email
            };

            request(app)
                .post("/share/s")
                .send(body)
                .expect(401)
                .end(done);
        });

        it("should not share data if invalid request (invalid userType)", (done) => {
            const body = {
                key: "allergy",
                buyerEmail: users[1].email
            };

            request(app)
                .post("/share/s")
                .set("x-auth", users[1].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not share data if invalid request (no key)", (done) => {
            const body = {
                one: "allergy",
                buyerEmail: users[1].email
            };

            request(app)
                .post("/share/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not share data if invalid request (invalid key)", (done) => {
            const body = {
                key: "none",
                buyerEmail: users[1].email
            };

            request(app)
                .post("/share/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not share data if invalid request (no buyerEmail)", (done) => {
            const body = {
                key: "allergy",
                two: users[1].email
            };

            request(app)
                .post("/share/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not share data if invalid request (unknown buyerEmail)", (done) => {
            const body = {
                key: "allergy",
                buyerEmail: "voi@email.com"
            };

            request(app)
                .post("/share/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });

        it("should not share data if invalid request (invalid buyerEmail(userType))", (done) => {
            const body = {
                key: "allergy",
                buyerEmail: users[2].email
            };

            request(app)
                .post("/share/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });
    });

    describe("NOT ACTIVATED", () => {
        describe("SELLER", () => {
            beforeEach(populateDeactivatedUsers);

            it("should not share data if authenticated, not activated", (done) => {
                const body = {
                    key: "allergy",
                    buyerEmail: users[1].email
                };

                request(app)
                    .post("/share/s")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(401)
                    .end(done);
            });
        });

        describe("BUYER", () => {
            beforeEach(populateActivatedSeller);
            afterEach(populateActivatedUsers);

            it("should not share data if authenticated, not activated", (done) => {
                const body = {
                    key: "allergy",
                    buyerEmail: users[1].email
                };

                request(app)
                    .post("/share/s")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });
    });

    describe("EMPTY", () => {
        describe("BUYER", () => {
            describe("DATA", () => {
                beforeEach(deleteUserData);

                it("should not share data if buyerData not in database", (done) => {
                    const body = {
                        key: "allergy",
                        buyerEmail: users[1].email
                    };

                    request(app)
                        .post("/share/s")
                        .set("x-auth", users[0].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });

            describe("RECORD", () => {
                beforeEach(deleteRecords);

                it("should not share data if buyerRecord not in database", (done) => {
                    const body = {
                        key: "allergy",
                        buyerEmail: users[1].email
                    };

                    request(app)
                        .post("/share/s")
                        .set("x-auth", users[0].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });
        });
        describe("SELLER", () => {
            describe("DATA", () => {
                beforeEach(populateBuyerData);

                it("should not share data if sellerData not in database", (done) => {
                    const body = {
                        key: "allergy",
                        buyerEmail: users[1].email
                    };

                    request(app)
                        .post("/share/s")
                        .set("x-auth", users[0].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });

            describe("RECORD", () => {
                beforeEach(populateBuyerRecord);

                it("should not share data if sellerRecord not in database", (done) => {
                    const body = {
                        key: "allergy",
                        buyerEmail: users[1].email
                    };

                    request(app)
                        .post("/share/s")
                        .set("x-auth", users[0].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });
        });
    });

    describe("NOT VERIFIED", () => {
        beforeEach(populateUnverifiedRecords);
        afterEach(populateVerifiedRecords);

        const doNotShareRecord = (key) => {
            it(`should not share ${key} if authenticated, activated, not verified`, (done) => {
                const body = {
                    key: "allergy",
                    buyerEmail: users[1].email
                };

                request(app)
                    .post("/share/s")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        };

        doNotShareRecord("allergy");

        doNotShareRecord("medication");

        doNotShareRecord("problem");

        doNotShareRecord("immunization");

        doNotShareRecord("vital_sign");

        doNotShareRecord("procedure");
    });
});

describe("POST /share/v", () => {
    describe("POPULATED", () => {
        const shareRecord = (key) => {
            it(`should share ${key} if authenticated, activated, verified`, (done) => {
                const body = {
                    key,
                    sellerEmail: users[0].email
                };

                request(app)
                    .post("/share/v")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.message).toBe(`${res.body.count} ${key} shared successfully`);
                        expect(res.body.count).toBe(1);
                        expect(res.body.email).toBe(users[2].email);
                    })
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: users[2]._id.toHexString() }).then((verifierRecord) => {
                            expect(verifierRecord.log.length).toBe(2);

                            Record.findOne({ _creator: users[0]._id.toHexString() }).then((sellerRecord) => {
                                expect(sellerRecord[key][1].toObject()).toMatchObject(verifierRecord[key][0].toObject());
                                expect(sellerRecord.log.length).toBe(2);
                            }).catch(e => done(e));
                        }).catch(e => done(e));

                        UserData.findOne({ _creator: users[2]._id.toHexString() }).then((sellerData) => {
                            expect(sellerData.message.sent.length).toBe(1);
                            expect(sellerData.message.sent[0].action).toBe("SENT");
                            expect(sellerData.message.sent[0].body.key).toBe(body.key);
                            expect(sellerData.message.sent[0].body.count).toBe(1);
                        }).catch(e => done(e));

                        UserData.findOne({ _creator: users[0]._id.toHexString() }).then((buyerData) => {
                            expect(buyerData.message.received.length).toBe(1);
                            expect(buyerData.message.received[0].action).toBe("RECEIVED");
                            expect(buyerData.message.received[0].body.key).toBe(body.key);
                            expect(buyerData.message.received[0].body.count).toBe(1);
                            expect(buyerData.message.received[0].from).toBe(users[2].email);
                        }).catch(e => done(e));

                        done();
                    });
            });
        };

        shareRecord("allergy");

        shareRecord("medication");

        shareRecord("problem");

        shareRecord("immunization");

        shareRecord("vital_sign");

        shareRecord("procedure");

        it("should not share data if not authenticated", (done) => {
            const body = {
                key: "allergy",
                sellerEmail: users[0].email
            };

            request(app)
                .post("/share/v")
                .send(body)
                .expect(401)
                .end(done);
        });

        it("should not share data if invalid request (invalid userType)", (done) => {
            const body = {
                key: "allergy",
                sellerEmail: users[0].email
            };

            request(app)
                .post("/share/v")
                .set("x-auth", users[1].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not share data if invalid request (no key)", (done) => {
            const body = {
                one: "allergy",
                sellerEmail: users[0].email
            };

            request(app)
                .post("/share/v")
                .set("x-auth", users[2].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not share data if invalid request (invalid key)", (done) => {
            const body = {
                key: "none",
                sellerEmail: users[0].email
            };

            request(app)
                .post("/share/v")
                .set("x-auth", users[2].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not share data if invalid request (no sellerEmail)", (done) => {
            const body = {
                key: "allergy",
                two: users[0].email
            };

            request(app)
                .post("/share/v")
                .set("x-auth", users[2].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not share data if invalid request (unknown sellerEmail)", (done) => {
            const body = {
                key: "allergy",
                sellerEmail: "seller@email.com"
            };

            request(app)
                .post("/share/v")
                .set("x-auth", users[2].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });

        it("should not share data if invalid request (invalid sellerEmail(userType))", (done) => {
            const body = {
                key: "allergy",
                sellerEmail: users[1].email
            };

            request(app)
                .post("/share/v")
                .set("x-auth", users[2].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });
    });

    describe("NOT ACTIVATED", () => {
        describe("VERIFIER", () => {
            beforeEach(populateDeactivatedUsers);

            it("should not share data if authenticated, not activated", (done) => {
                const body = {
                    key: "allergy",
                    sellerEmail: users[0].email
                };

                request(app)
                    .post("/share/v")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(401)
                    .end(done);
            });
        });

        describe("SELLER", () => {
            beforeEach(populateActivatedVerifier);
            afterEach(populateActivatedUsers);

            it("should not share data if authenticated, not activated", (done) => {
                const body = {
                    key: "allergy",
                    sellerEmail: users[0].email
                };

                request(app)
                    .post("/share/v")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });
    });

    describe("EMPTY", () => {
        describe("SELLER", () => {
            describe("DATA", () => {
                beforeEach(deleteUserData);

                it("should not share data if sellerData not in database", (done) => {
                    const body = {
                        key: "allergy",
                        sellerEmail: users[0].email
                    };

                    request(app)
                        .post("/share/v")
                        .set("x-auth", users[2].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });

            describe("RECORD", () => {
                beforeEach(deleteRecords);

                it("should not share data if sellerRecord not in database", (done) => {
                    const body = {
                        key: "allergy",
                        sellerEmail: users[0].email
                    };

                    request(app)
                        .post("/share/v")
                        .set("x-auth", users[2].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });
        });
        describe("VERIFIER", () => {
            describe("DATA", () => {
                beforeEach(populateSellerData);

                it("should not share data if verifierData not in database", (done) => {
                    const body = {
                        key: "allergy",
                        sellerEmail: users[0].email
                    };

                    request(app)
                        .post("/share/v")
                        .set("x-auth", users[2].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });

            describe("RECORD", () => {
                beforeEach(populateSellerRecord);

                it("should not share data if verifierRecord not in database", (done) => {
                    const body = {
                        key: "allergy",
                        sellerEmail: users[0].email
                    };

                    request(app)
                        .post("/share/v")
                        .set("x-auth", users[2].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });
        });
    });

    describe("NOT VERIFIED", () => {
        beforeEach(populateUnverifiedRecords);
        afterEach(populateVerifiedRecords);

        const doNotShareRecord = (key) => {
            it(`should not share ${key} if authenticated, activated, not verified`, (done) => {
                const body = {
                    key: "allergy",
                    sellerEmail: users[0].email
                };

                request(app)
                    .post("/share/v")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        };

        doNotShareRecord("allergy");

        doNotShareRecord("medication");

        doNotShareRecord("problem");

        doNotShareRecord("immunization");

        doNotShareRecord("vital_sign");

        doNotShareRecord("procedure");
    });
});

describe("POST /verify/s", () => {
    describe("POPULATED", () => {
        it("should request verification if authenticated, activated", (done) => {
            const body = {
                key: "allergy",
                verifierEmail: users[2].email
            };

            request(app)
                .post("/verify/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe("verification requested successfully");
                    expect(res.body.email).toBe(users[0].email);
                })
                .end((err) => {
                    if (err) {
                        done(err);
                    }

                    UserData.findOne({ _creator: users[0]._id.toHexString() }).then((sellerData) => {
                        expect(sellerData.message.sent.length).toBe(2);
                        expect(sellerData.message.sent[0].action).toBe("VERIFY");
                        expect(sellerData.message.sent[0].body.key).toBe(body.key);
                        expect(sellerData.message.sent[0].to).toBe(body.verifierEmail);
                    }).catch(e => done(e));

                    UserData.findOne({ _creator: users[2]._id.toHexString() }).then((verifierData) => {
                        expect(verifierData.message.received.length).toBe(2);
                        expect(verifierData.message.received[0].action).toBe("VERIFY");
                        expect(verifierData.message.received[0].body.key).toBe(body.key);
                        expect(verifierData.message.received[0].from).toBe(users[0].email);
                    }).catch(e => done(e));

                    done();
                });
        });

        it("should not request verification if not authenticated", (done) => {
            const body = {
                key: "allergy",
                verifierEmail: users[2].email
            };

            request(app)
                .post("/verify/s")
                .send(body)
                .expect(401)
                .end(done);
        });

        it("should not request verification if invalid request (invalid userType)", (done) => {
            const body = {
                key: "allergy",
                verifierEmail: users[2].email
            };

            request(app)
                .post("/verify/s")
                .set("x-auth", users[1].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not request verification if invalid request (no key)", (done) => {
            const body = {
                one: "allergy",
                verifierEmail: users[2].email
            };

            request(app)
                .post("/verify/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not request verification if invalid request (invalid key)", (done) => {
            const body = {
                key: "none",
                verifierEmail: users[2].email
            };

            request(app)
                .post("/verify/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not request verification if invalid request (no verifierEmail)", (done) => {
            const body = {
                key: "none",
                two: "two"
            };

            request(app)
                .post("/verify/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not request verification if invalid request (unknown verifierEmail)", (done) => {
            const body = {
                key: "allergy",
                verifierEmail: "example@email.com"
            };

            request(app)
                .post("/verify/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });

        it("should not request verification if invalid request (invalid verifierEmail(userType))", (done) => {
            const body = {
                key: "allergy",
                verifierEmail: users[1].email
            };

            request(app)
                .post("/verify/s")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });
    });

    describe("NOT ACTIVATED", () => {
        describe("SELLER", () => {
            beforeEach(populateDeactivatedUsers);

            it("should not share data if authenticated, not activated", (done) => {
                const body = {
                    key: "allergy",
                    verifierEmail: users[2].email
                };

                request(app)
                    .post("/verify/s")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(401)
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            beforeEach(populateActivatedSeller);
            afterEach(populateActivatedUsers);

            it("should not share data if authenticated, not activated", (done) => {
                const body = {
                    key: "allergy",
                    verifierEmail: users[2].email
                };

                request(app)
                    .post("/verify/s")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });
    });

    describe("EMPTY", () => {
        describe("VERIFIER", () => {
            describe("DATA", () => {
                beforeEach(deleteUserData);

                it("should not request verification if verifierData not in database", (done) => {
                    const body = {
                        key: "allergy",
                        verifierEmail: users[2].email
                    };

                    request(app)
                        .post("/verify/s")
                        .set("x-auth", users[0].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });
        });

        describe("SELLER", () => {
            describe("DATA", () => {
                beforeEach(populateVerifierData);

                it("should not request verification if sellerData not in database", (done) => {
                    const body = {
                        key: "allergy",
                        verifierEmail: users[2].email
                    };

                    request(app)
                        .post("/verify/s")
                        .set("x-auth", users[0].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });

            describe("RECORD", () => {
                beforeEach(deleteRecords);

                it("should not request verification if sellerRecord not in database", (done) => {
                    const body = {
                        key: "allergy",
                        verifierEmail: users[2].email
                    };

                    request(app)
                        .post("/verify/s")
                        .set("x-auth", users[0].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });
        });
    });
});

describe("GET /verify/v", () => {
    describe("POPULATED", () => {
        beforeEach(populateUnverifiedRecords);

        it("should get record for verification if authenticated", (done) => {
            const { _id } = userData[2].message.received[0];

            request(app)
                .get(`/verify/v?id=${_id.toHexString()}`)
                .set("x-auth", users[2].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.record).toBeTruthy();
                    expect(res.body.seller).toBe(users[0].email);
                    expect(res.body.email).toBe(users[2].email);
                })
                .end(done);
        });

        it("should not get record for verification if not authenticated", (done) => {
            const { _id } = userData[2].message.received[0];

            request(app)
                .get(`/verify/v?id=${_id.toHexString()}`)
                .expect(401)
                .end(done);
        });

        it("should not get record for verification if request invalid (invalid userType)", (done) => {
            const { _id } = userData[2].message.received[0];

            request(app)
                .get(`/verify/v?id=${_id.toHexString()}`)
                .set("x-auth", users[1].tokens[0].token)
                .expect(400)
                .end(done);
        });

        it("should not get record for verification if request invalid (no id)", (done) => {
            request(app)
                .get("/verify/v")
                .set("x-auth", users[2].tokens[0].token)
                .expect(400)
                .end(done);
        });

        it("should not get record for verification if request invalid (invalid id)", (done) => {
            request(app)
                .get("/verify/v?id=1234")
                .set("x-auth", users[2].tokens[0].token)
                .expect(400)
                .end(done);
        });
    });

    describe("NOT ACTIVATED", () => {
        describe("VERIFIER", () => {
            beforeEach(populateDeactivatedUsers);

            it("should not get record for verification if authenticated, not activated", (done) => {
                const { _id } = userData[2].message.received[0];

                request(app)
                    .get(`/verify/v?id=${_id.toHexString()}`)
                    .expect(401)
                    .end(done);
            });
        });

        describe("SELLER", () => {
            beforeEach(populateActivatedVerifier);
            afterEach(populateActivatedUsers);

            it("should not get record for verification if authenticated, not activated", (done) => {
                const { _id } = userData[2].message.received[0];

                request(app)
                    .get(`/verify/v?id=${_id.toHexString()}`)
                    .set("x-auth", users[2].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });
    });

    describe("ALL VERIFIED", () => {
        beforeEach(populateVerifiedRecords);

        it("should not get record for verification if all verified", (done) => {
            const { _id } = new ObjectID();

            request(app)
                .get(`/verify/v?id=${_id.toHexString()}`)
                .set("x-auth", users[2].tokens[0].token)
                .expect(400)
                .end(done);
        });
    });

    describe("EMPTY", () => {
        describe("VERIFIER", () => {
            describe("DATA", () => {
                beforeEach(deleteUserData);

                it("should not get record for verification if userData not in database", (done) => {
                    const { _id } = userData[2].message.received[0];

                    request(app)
                        .get(`/verify/v?id=${_id.toHexString()}`)
                        .set("x-auth", users[2].tokens[0].token)
                        .expect(404)
                        .end(done);
                });
            });
        });

        describe("SELLER", () => {
            describe("USER", () => {
                beforeEach(populateVerifier);

                it("should not get record for verification if user not in database", (done) => {
                    const { _id } = userData[2].message.received[0];

                    request(app)
                        .get(`/verify/v?id=${_id.toHexString()}`)
                        .set("x-auth", users[2].tokens[0].token)
                        .expect(404)
                        .end(done);
                });
            });

            describe("RECORD", () => {
                beforeEach(populateVerifierRecord);

                it("should not get record for verification if record not in database", (done) => {
                    const { _id } = userData[2].message.received[0];

                    request(app)
                        .get(`/verify/v?id=${_id.toHexString()}`)
                        .set("x-auth", users[2].tokens[0].token)
                        .expect(404)
                        .end(done);
                });
            });
        });
    });
});

describe("POST /verify/v", () => {
    describe("POPULATED", () => {
        const verifyRecord = (key) => {
            beforeEach(populateUnverifiedRecords);

            it(`should verify ${key} if authenticated, activated, unverified`, (done) => {
                const body = {
                    key,
                    sellerEmail: users[0].email
                };

                request(app)
                    .post("/verify/v")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.message).toBe(`${res.body.count} ${key} verified successfully`);
                        expect(res.body.count).toBe(1);
                        expect(res.body.email).toBe(users[2].email);
                    })
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: users[2]._id.toHexString() }).then((verifierRecord) => {
                            expect(verifierRecord.log.length).toBe(2);

                            Record.findOne({ _creator: users[0]._id.toHexString() }).then((sellerRecord) => {
                                expect(sellerRecord.log.length).toBe(2);

                                let verifier;
                                let seller;
                                try {
                                    verifier = jwt.verify(verifierRecord[key][1].verifier[0], process.env.USER_SECRET);
                                    seller = jwt.verify(sellerRecord[key][0].owner[0], process.env.USER_SECRET);
                                } catch (e) {
                                    done(e);
                                }

                                expect(verifierRecord[key][1]._id.toHexString()).toBe(records[0][body.key][0]._id.toHexString());
                                expect(verifierRecord[key][1].isVerified).toBeTruthy();
                                expect(verifier.owner).toBe(users[2]._id.toHexString());
                                expect(verifier.record).toBe(records[2]._id.toHexString());
                                expect(sellerRecord[key][0]._id.toHexString()).toBe(records[0][body.key][0]._id.toHexString());
                                expect(sellerRecord[key][0].isVerified).toBeTruthy();
                                expect(seller.owner).toBe(users[0]._id.toHexString());
                                expect(seller.record).toBe(records[0]._id.toHexString());
                            }).catch(e => done(e));
                        }).catch(e => done(e));

                        UserData.findOne({ _creator: users[2]._id.toHexString() }).then((sellerData) => {
                            expect(sellerData.message.sent.length).toBe(1);
                            expect(sellerData.message.sent[0].action).toBe("VERIFIED");
                            expect(sellerData.message.sent[0].body.key).toBe(body.key);
                            expect(sellerData.message.sent[0].body.count).toBe(1);
                        }).catch(e => done(e));

                        UserData.findOne({ _creator: users[0]._id.toHexString() }).then((buyerData) => {
                            expect(buyerData.message.received.length).toBe(1);
                            expect(buyerData.message.received[0].action).toBe("VERIFIED");
                            expect(buyerData.message.received[0].body.key).toBe(body.key);
                            expect(buyerData.message.received[0].body.count).toBe(1);
                            expect(buyerData.message.received[0].from).toBe(users[2].email);
                        }).catch(e => done(e));

                        done();
                    });
            });
        };

        verifyRecord("allergy");

        verifyRecord("medication");

        verifyRecord("problem");

        verifyRecord("immunization");

        verifyRecord("vital_sign");

        verifyRecord("procedure");

        it("should not verify record if not authenticated", (done) => {
            const body = {
                key: "allergy",
                sellerEmail: users[0].email
            };

            request(app)
                .post("/verify/v")
                .send(body)
                .expect(401)
                .end(done);
        });

        it("should not verify record if invalid request (invalid userType)", (done) => {
            const body = {
                key: "allergy",
                sellerEmail: users[0].email
            };

            request(app)
                .post("/verify/v")
                .set("x-auth", users[1].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not verify record if invalid request (no key)", (done) => {
            const body = {
                one: "allergy",
                sellerEmail: users[0].email
            };

            request(app)
                .post("/verify/v")
                .set("x-auth", users[2].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not verify record if invalid request (invalid key)", (done) => {
            const body = {
                key: "none",
                sellerEmail: users[0].email
            };

            request(app)
                .post("/verify/v")
                .set("x-auth", users[2].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not verify record if invalid request (no sellerEmail)", (done) => {
            const body = {
                key: "allergy",
                two: users[0].email
            };

            request(app)
                .post("/verify/v")
                .set("x-auth", users[2].tokens[0].token)
                .send(body)
                .expect(400)
                .end(done);
        });

        it("should not verify record if invalid request (unknown sellerEmail)", (done) => {
            const body = {
                key: "allergy",
                sellerEmail: "seller@email.com"
            };

            request(app)
                .post("/verify/v")
                .set("x-auth", users[2].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });

        it("should not verify record if invalid request (invalid sellerEmail(userType))", (done) => {
            const body = {
                key: "allergy",
                sellerEmail: users[1].email
            };

            request(app)
                .post("/verify/v")
                .set("x-auth", users[2].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });
    });

    describe("NOT ACTIVATED", () => {
        describe("VERIFIER", () => {
            beforeEach(populateDeactivatedUsers);

            it("should not verify record if authenticated, not activated", (done) => {
                const body = {
                    key: "allergy",
                    sellerEmail: users[0].email
                };

                request(app)
                    .post("/verify/v")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(401)
                    .end(done);
            });
        });

        describe("SELLER", () => {
            beforeEach(populateActivatedVerifier);
            afterEach(populateActivatedUsers);

            it("should not verify record if authenticated, not activated", (done) => {
                const body = {
                    key: "allergy",
                    sellerEmail: users[0].email
                };

                request(app)
                    .post("/verify/v")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });
    });

    describe("EMPTY", () => {
        describe("SELLER", () => {
            describe("DATA", () => {
                beforeEach(deleteUserData);

                it("should not verify record if sellerData not in database", (done) => {
                    const body = {
                        key: "allergy",
                        sellerEmail: users[0].email
                    };

                    request(app)
                        .post("/verify/v")
                        .set("x-auth", users[2].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });

            describe("RECORD", () => {
                beforeEach(deleteRecords);

                it("should not verify record if sellerRecord not in database", (done) => {
                    const body = {
                        key: "allergy",
                        sellerEmail: users[0].email
                    };

                    request(app)
                        .post("/verify/v")
                        .set("x-auth", users[2].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });
        });
        describe("VERIFIER", () => {
            describe("DATA", () => {
                beforeEach(populateSellerData);

                it("should not verify record if verifierData not in database", (done) => {
                    const body = {
                        key: "allergy",
                        sellerEmail: users[0].email
                    };

                    request(app)
                        .post("/verify/v")
                        .set("x-auth", users[2].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });

            describe("RECORD", () => {
                beforeEach(populateSellerRecord);

                it("should not verify record if verifierRecord not in database", (done) => {
                    const body = {
                        key: "allergy",
                        sellerEmail: users[0].email
                    };

                    request(app)
                        .post("/verify/v")
                        .set("x-auth", users[2].tokens[0].token)
                        .send(body)
                        .expect(404)
                        .end(done);
                });
            });
        });
    });

    describe("NOT VERIFIED", () => {
        beforeEach(populateVerifiedRecords);

        const doNotVerifyRecord = (key) => {
            it(`should not verify ${key} if authenticated, activated, verified`, (done) => {
                const body = {
                    key: "allergy",
                    sellerEmail: users[0].email
                };

                request(app)
                    .post("/verify/v")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        };

        doNotVerifyRecord("allergy");

        doNotVerifyRecord("medication");

        doNotVerifyRecord("problem");

        doNotVerifyRecord("immunization");

        doNotVerifyRecord("vital_sign");

        doNotVerifyRecord("procedure");
    });
});
