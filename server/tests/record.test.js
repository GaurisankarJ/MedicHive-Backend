// Mocha Test Framework

// Testing with Jest, expect function
const expect = require("expect");
// Testing HTTP via superagent
const request = require("supertest");
// JSON Web Token Middleware
const jwt = require("jsonwebtoken");

// The app for testing
const { app } = require("./../server.js");
// Record Model
const { Record } = require("../models/record.js");

// Seed Data
const { users, populateUsers, records, deleteRecords, populateRecords, populateUnverifiedRecords } = require("./seed/seed");

// Testing life-cycle, beforeEach Hook
// Populating Users
beforeEach(populateUsers);
// Populating Records
beforeEach(populateRecords);

describe("POST /record", () => {
    describe("EMPTY", () => {
        beforeEach(deleteRecords);

        it("should create record if authenticated", (done) => {
            request(app)
                .post("/record")
                .set("x-auth", users[1].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe("record created");
                    expect(res.body.email).toBe(users[1].email);
                })
                .end((err) => {
                    if (err) {
                        done(err);
                    }

                    Record.findOne({ _creator: users[1]._id.toHexString() }).then((record) => {
                        const action = record.log[0].action.split(":");

                        expect(action[0]).toBe("GENESIS");
                        expect(action[1]).toBe(`USER${users[1]._id.toHexString()}`);
                        expect(record.log[0].body.userType).toBe(users[1].userType);
                        expect(record._creator.toHexString()).toBe(users[1]._id.toString());
                        done();
                    }).catch(e => done(e));
                });
        });

        it("should not create record if not authenticated", (done) => {
            request(app)
                .post("/record")
                .expect(401)
                .end(done);
        });
    });

    describe("POPULATED", () => {
        it("should not create record if record in database", (done) => {
            request(app)
                .post("/record")
                .set("x-auth", users[0].tokens[0].token)
                .expect(400)
                .end(done);
        });
    });
});

describe("GET /record", () => {
    describe("POPULATED", () => {
        describe("SELLER", () => {
            it("should get record if authenticated", (done) => {
                request(app)
                    .get("/record")
                    .set("x-auth", users[0].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.email).toBe(users[0].email);
                        expect(res.body.record.allergy[0].data).toBe(records[0].allergy[0].data);
                        expect(res.body.record.allergy[0].createdAt).toBe(records[0].allergy[0].createdAt);
                        expect(res.body.record.allergy[0].owner[0]).toBe(records[0].allergy[0].owner[0].email);
                        expect(res.body.record.medication[0].data).toBe(records[0].medication[0].data);
                        expect(res.body.record.medication[0].createdAt).toBe(records[0].medication[0].createdAt);
                        expect(res.body.record.medication[0].owner[0]).toBe(records[0].medication[0].owner[0].email);
                        expect(res.body.record.problem[0].data).toBe(records[0].problem[0].data);
                        expect(res.body.record.problem[0].createdAt).toBe(records[0].problem[0].createdAt);
                        expect(res.body.record.problem[0].owner[0]).toBe(records[0].problem[0].owner[0].email);
                        expect(res.body.record.immunization[0].data).toBe(records[0].immunization[0].data);
                        expect(res.body.record.immunization[0].createdAt).toBe(records[0].immunization[0].createdAt);
                        expect(res.body.record.immunization[0].owner[0]).toBe(records[0].immunization[0].owner[0].email);
                        expect(res.body.record.vital_sign[0].data).toBe(records[0].vital_sign[0].data);
                        expect(res.body.record.vital_sign[0].createdAt).toBe(records[0].vital_sign[0].createdAt);
                        expect(res.body.record.vital_sign[0].owner[0]).toBe(records[0].vital_sign[0].owner[0].email);
                        expect(res.body.record.procedure[0].data).toBe(records[0].procedure[0].data);
                        expect(res.body.record.procedure[0].createdAt).toBe(records[0].procedure[0].createdAt);
                        expect(res.body.record.procedure[0].owner[0]).toBe(records[0].procedure[0].owner[0].email);
                    })
                    .end(done);
            });
        });

        describe("BUYER", () => {
            it("should get record if authenticated", (done) => {
                request(app)
                    .get("/record")
                    .set("x-auth", users[1].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.email).toBe(users[1].email);
                        expect(res.body.record.allergy[0].data).toBe(records[1].allergy[0].data);
                        expect(res.body.record.allergy[0].createdAt).toBe(records[1].allergy[0].createdAt);
                        expect(res.body.record.allergy[0].owner[0]).toBe(records[1].allergy[0].owner[0].email);
                        expect(res.body.record.allergy[0].owner[1]).toBe(records[1].allergy[0].owner[1].email);
                        expect(res.body.record.allergy[0].verifier[0]).toBe(records[1].allergy[0].verifier[0].email);
                        expect(res.body.record.medication[0].data).toBe(records[1].medication[0].data);
                        expect(res.body.record.medication[0].createdAt).toBe(records[1].medication[0].createdAt);
                        expect(res.body.record.medication[0].owner[0]).toBe(records[1].medication[0].owner[0].email);
                        expect(res.body.record.medication[0].owner[1]).toBe(records[1].medication[0].owner[1].email);
                        expect(res.body.record.medication[0].verifier[0]).toBe(records[1].medication[0].verifier[0].email);
                        expect(res.body.record.problem[0].data).toBe(records[1].problem[0].data);
                        expect(res.body.record.problem[0].createdAt).toBe(records[1].problem[0].createdAt);
                        expect(res.body.record.problem[0].owner[0]).toBe(records[1].problem[0].owner[0].email);
                        expect(res.body.record.problem[0].owner[1]).toBe(records[1].problem[0].owner[1].email);
                        expect(res.body.record.problem[0].verifier[0]).toBe(records[1].problem[0].verifier[0].email);
                        expect(res.body.record.immunization[0].data).toBe(records[1].immunization[0].data);
                        expect(res.body.record.immunization[0].createdAt).toBe(records[1].immunization[0].createdAt);
                        expect(res.body.record.immunization[0].owner[0]).toBe(records[1].immunization[0].owner[0].email);
                        expect(res.body.record.immunization[0].owner[1]).toBe(records[1].immunization[0].owner[1].email);
                        expect(res.body.record.immunization[0].verifier[0]).toBe(records[1].immunization[0].verifier[0].email);
                        expect(res.body.record.vital_sign[0].data).toBe(records[1].vital_sign[0].data);
                        expect(res.body.record.vital_sign[0].createdAt).toBe(records[1].vital_sign[0].createdAt);
                        expect(res.body.record.vital_sign[0].owner[0]).toBe(records[1].vital_sign[0].owner[0].email);
                        expect(res.body.record.vital_sign[0].owner[1]).toBe(records[1].vital_sign[0].owner[1].email);
                        expect(res.body.record.vital_sign[0].verifier[0]).toBe(records[1].vital_sign[0].verifier[0].email);
                        expect(res.body.record.procedure[0].data).toBe(records[1].procedure[0].data);
                        expect(res.body.record.procedure[0].createdAt).toBe(records[1].procedure[0].createdAt);
                        expect(res.body.record.procedure[0].owner[0]).toBe(records[1].procedure[0].owner[0].email);
                        expect(res.body.record.procedure[0].owner[1]).toBe(records[1].procedure[0].owner[1].email);
                        expect(res.body.record.procedure[0].verifier[0]).toBe(records[1].procedure[0].verifier[0].email);
                    })
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            it("should get record if authenticated", (done) => {
                request(app)
                    .get("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.email).toBe(users[2].email);
                        expect(res.body.record.allergy[0].data).toBe(records[2].allergy[0].data);
                        expect(res.body.record.allergy[0].createdAt).toBe(records[2].allergy[0].createdAt);
                        expect(res.body.record.allergy[0].owner[0]).toBe(records[2].allergy[0].owner[0].email);
                        expect(res.body.record.allergy[0].verifier[0]).toBe(records[2].allergy[0].verifier[0].email);
                        expect(res.body.record.medication[0].data).toBe(records[2].medication[0].data);
                        expect(res.body.record.medication[0].createdAt).toBe(records[2].medication[0].createdAt);
                        expect(res.body.record.medication[0].owner[0]).toBe(records[2].medication[0].owner[0].email);
                        expect(res.body.record.medication[0].verifier[0]).toBe(records[2].medication[0].verifier[0].email);
                        expect(res.body.record.problem[0].data).toBe(records[2].problem[0].data);
                        expect(res.body.record.problem[0].createdAt).toBe(records[2].problem[0].createdAt);
                        expect(res.body.record.problem[0].owner[0]).toBe(records[2].problem[0].owner[0].email);
                        expect(res.body.record.problem[0].verifier[0]).toBe(records[2].problem[0].verifier[0].email);
                        expect(res.body.record.immunization[0].data).toBe(records[2].immunization[0].data);
                        expect(res.body.record.immunization[0].createdAt).toBe(records[2].immunization[0].createdAt);
                        expect(res.body.record.immunization[0].owner[0]).toBe(records[2].immunization[0].owner[0].email);
                        expect(res.body.record.immunization[0].verifier[0]).toBe(records[2].immunization[0].verifier[0].email);
                        expect(res.body.record.vital_sign[0].data).toBe(records[2].vital_sign[0].data);
                        expect(res.body.record.vital_sign[0].createdAt).toBe(records[2].vital_sign[0].createdAt);
                        expect(res.body.record.vital_sign[0].owner[0]).toBe(records[2].vital_sign[0].owner[0].email);
                        expect(res.body.record.vital_sign[0].verifier[0]).toBe(records[2].vital_sign[0].verifier[0].email);
                        expect(res.body.record.procedure[0].data).toBe(records[2].procedure[0].data);
                        expect(res.body.record.procedure[0].createdAt).toBe(records[2].procedure[0].createdAt);
                        expect(res.body.record.procedure[0].owner[0]).toBe(records[2].procedure[0].owner[0].email);
                        expect(res.body.record.procedure[0].verifier[0]).toBe(records[2].procedure[0].verifier[0].email);
                    })
                    .end(done);
            });
        });

        describe("COMMON", () => {
            it("should not get record if not authenticated", (done) => {
                request(app)
                    .get("/record")
                    .expect(401)
                    .end(done);
            });
        });
    });

    describe("EMPTY", () => {
        beforeEach(deleteRecords);

        it("should not get record if record not in database", (done) => {
            request(app)
                .get("/record")
                .set("x-auth", users[1].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });
});

describe("DELETE /record", () => {
    describe("POPULATED", () => {
        it("should delete record if authenticated", (done) => {
            request(app)
                .delete("/record")
                .set("x-auth", users[2].tokens[0].token)
                .expect(200)
                .end((err) => {
                    if (err) {
                        done(err);
                    }

                    Record.findOne({ _creator: users[2]._id }).then((record) => {
                        expect(record).toBeFalsy();
                        done();
                    }).catch(e => done(e));
                });
        });

        it("should not delete record if not authenticated", (done) => {
            request(app)
                .delete("/record")
                .expect(401)
                .end(done);
        });
    });

    describe("EMPTY", () => {
        beforeEach(deleteRecords);

        it("should not delete record if record not in database", (done) => {
            request(app)
                .delete("/record")
                .set("x-auth", users[1].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });
});

describe("PATCH /record", () => {
    describe("POPULATED", () => {
        describe("SELLER", () => {
            beforeEach(populateUnverifiedRecords);

            const patchRecord = (user, key) => {
                it(`should patch ${key} if authenticated`, (done) => {
                    const body = {
                        key,
                        value: ["New value", "Other new value"]
                    };

                    request(app)
                        .patch("/record")
                        .set("x-auth", user.tokens[0].token)
                        .send(body)
                        .expect(200)
                        .expect((res) => {
                            expect(res.body.message).toBe(`${body.key} updated`);
                            expect(res.body.email).toBe(user.email);
                        })
                        .end((err) => {
                            if (err) {
                                done(err);
                            }

                            Record.findOne({ _creator: user._id }).then((record) => {
                                expect(record[key].length).toBe(3);
                                record[key].forEach((rec, i) => {
                                    if (i !== 0) {
                                        expect(rec.data).toBe(body.value[i - 1]);
                                        expect(rec.owner[0].email).toBe(user.email);

                                        const signOwner = jwt.verify(rec.owner[0].sign, process.env.USER_SECRET);
                                        expect(signOwner.owner).toBe(user._id.toHexString());
                                        expect(signOwner.record).toBe(record._id.toHexString());
                                        expect(signOwner.time).toBeTruthy();

                                        expect(rec.verifier.length).toBe(0);
                                        expect(rec.createdAt).toBeTruthy();
                                    }
                                });
                                expect(record.log.length).toBe(3);
                                expect(record.log[1].body.key).toBe(body.key);
                                expect(record.log[1].body.value).toBe(body.value[0]);
                                expect(record.log[2].body.key).toBe(body.key);
                                expect(record.log[2].body.value).toBe(body.value[1]);
                                done();
                            }).catch(e => done(e));
                        });
                });
            };

            patchRecord(users[0], "allergy");

            patchRecord(users[0], "medication");

            patchRecord(users[0], "problem");

            patchRecord(users[0], "immunization");

            patchRecord(users[0], "vital_sign");

            patchRecord(users[0], "procedure");
        });

        describe("VERIFIER", () => {
            const patchRecord = (user, key) => {
                it(`should patch ${key} if authenticated`, (done) => {
                    const body = {
                        key,
                        value: ["New value", "Other new value"],
                        sellerEmail: users[0].email
                    };

                    request(app)
                        .patch("/record")
                        .set("x-auth", user.tokens[0].token)
                        .send(body)
                        .expect(200)
                        .expect((res) => {
                            expect(res.body.message).toBe(`${body.key} updated`);
                            expect(res.body.email).toBe(user.email);
                        })
                        .end((err) => {
                            if (err) {
                                done(err);
                            }

                            Record.findOne({ _creator: user._id }).then((record) => {
                                expect(record[key].length).toBe(3);
                                record[key].forEach((rec, i) => {
                                    if (i !== 0) {
                                        expect(rec.data).toBe(body.value[i - 1]);
                                        expect(rec.owner[0].email).toBe(users[0].email);
                                        expect(rec.verifier[0].email).toBe(user.email);

                                        const signOwner = jwt.verify(rec.owner[0].sign, process.env.USER_SECRET);
                                        expect(signOwner.owner).toBe(users[0]._id.toHexString());
                                        expect(signOwner.record).toBe(records[0]._id.toHexString());
                                        expect(signOwner.time).toBeTruthy();

                                        const signVerifier = jwt.verify(rec.verifier[0].sign, process.env.USER_SECRET);
                                        expect(signVerifier.owner).toBe(user._id.toHexString());
                                        expect(signVerifier.record).toBe(record._id.toHexString());
                                        expect(signVerifier.time).toBeTruthy();

                                        expect(rec.createdAt).toBeTruthy();
                                    }
                                });

                                expect(record.log.length).toBe(3);
                                expect(record.log[1].body.key).toBe(body.key);
                                expect(record.log[1].body.value).toBe(body.value[0]);
                                expect(record.log[2].body.key).toBe(body.key);
                                expect(record.log[2].body.value).toBe(body.value[1]);

                                done();
                            }).catch(e => done(e));
                        });
                });
            };

            patchRecord(users[2], "allergy");

            patchRecord(users[2], "medication");

            patchRecord(users[2], "problem");

            patchRecord(users[2], "immunization");

            patchRecord(users[2], "vital_sign");

            patchRecord(users[2], "procedure");

            it("should not patch record if request invalid (no sellerEmail)", (done) => {
                const body = {
                    key: "allergy",
                    value: ["New allergy"]
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch record if request invalid (invalid sellerEmail)", (done) => {
                const body = {
                    key: "allergy",
                    value: ["New allergy"],
                    sellerEmail: "new@mail.com"
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });

            it("should not patch record if request invalid (invalid seller/userType)", (done) => {
                const body = {
                    key: "allergy",
                    value: ["New allergy"],
                    sellerEmail: users[1].email
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });

        describe("COMMON", () => {
            it("should not patch record if not authenticated", (done) => {
                const body = {
                    key: "allergy",
                    value: ["New allergy"]
                };

                request(app)
                    .patch("/record")
                    .send(body)
                    .expect(401)
                    .end(done);
            });

            it("should not patch record if userType 'b'", (done) => {
                const body = {
                    key: "allergy",
                    value: ["New allergy"]
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch record if request invalid (no key)", (done) => {
                const body = {
                    one: "allergy",
                    value: ["New allergy"]
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch record if request invalid (invalid key)", (done) => {
                const body = {
                    key: "none",
                    value: ["New allergy"]
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch record if request invalid (no value)", (done) => {
                const body = {
                    key: "allergy",
                    two: ["New allergy"]
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        });
    });

    describe("EMPTY", () => {
        beforeEach(deleteRecords);

        it("should not patch record if record not in database", (done) => {
            const body = {
                key: "allergy",
                value: ["New allergy"]
            };

            request(app)
                .patch("/record")
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });
    });
});

describe("DELETE /record/:id", () => {
    describe("POPULATED", () => {
        const deleteRecord = (user, key) => {
            it(`should delete ${key} if authenticated`, (done) => {
                const id = records[0][key][0]._id.toHexString();

                request(app)
                    .delete(`/record/${id}`)
                    .set("x-auth", user.tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.message).toBe("record deleted");
                        expect(res.body.email).toBe(user.email);
                    })
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: user._id }).then((record) => {
                            expect(record[key].length).toBe(0);
                            expect(record.log.length).toBe(2);
                            expect(record.log[1].body.key).toBe(id);
                            expect(record.log[1].createdAt).toBeTruthy();

                            done();
                        }).catch(e => done(e));
                    });
            });
        };

        deleteRecord(users[0], "allergy");

        deleteRecord(users[0], "medication");

        deleteRecord(users[0], "problem");

        deleteRecord(users[0], "immunization");

        deleteRecord(users[0], "vital_sign");

        deleteRecord(users[0], "procedure");

        it("should not delete record element if not authenticated", (done) => {
            const id = records[1].allergy[0]._id;

            request(app)
                .delete(`/record/${id}`)
                .expect(401)
                .end(done);
        });

        it("should not delete record element if request invalid (invalid id)", (done) => {
            const id = "invalid";

            request(app)
                .delete(`/record/${id}`)
                .set("x-auth", users[0].tokens[0].token)
                .expect(400)
                .end(done);
        });

        it("should not delete record element if request invalid (unknown id)", (done) => {
            const id = records[0]._id;

            request(app)
                .delete(`/record/${id}`)
                .set("x-auth", users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });

    describe("EMPTY", () => {
        beforeEach(deleteRecords);

        it("should not delete record element if record not in database", (done) => {
            const id = records[0].allergy[0]._id;

            request(app)
                .delete(`/record/${id}`)
                .set("x-auth", users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });
});

describe("PATCH /record/:id", () => {
    describe("POPULATED", () => {
        describe("SELLER", () => {
            const patchRecord = (user, key) => {
                it(`should patch ${key} if authenticated`, (done) => {
                    const id = records[0][key][0]._id.toHexString();
                    const body = {
                        value: `new ${key}`
                    };

                    request(app)
                        .patch(`/record/${id}`)
                        .set("x-auth", user.tokens[0].token)
                        .send(body)
                        .expect(200)
                        .expect((res) => {
                            expect(res.body.message).toBe("record updated");
                            expect(res.body.email).toBe(user.email);
                        })
                        .end((err) => {
                            if (err) {
                                done(err);
                            }

                            Record.findOne({ _creator: user._id }).then((record) => {
                                expect(record[key].length).toBe(1);
                                expect(record[key][0].data).toBe(body.value);
                                expect(record[key][0].owner[0].email).toBe(user.email);
                                expect(record[key][0].verifier.length).toBe(0);
                                expect(record[key][0].updatedAt).toBeTruthy();

                                const signOwner = jwt.verify(record[key][0].owner[0].sign, process.env.USER_SECRET);
                                expect(signOwner.owner).toBe(user._id.toHexString());
                                expect(signOwner.record).toBe(records[0]._id.toHexString());
                                expect(signOwner.time).toBeTruthy();

                                expect(record.log.length).toBe(2);
                                expect(record.log[1].body.key).toBe(id);
                                expect(record.log[1].createdAt).toBeTruthy();

                                done();
                            }).catch(e => done(e));
                        });
                });
            };

            patchRecord(users[0], "allergy");

            patchRecord(users[0], "medication");

            patchRecord(users[0], "problem");

            patchRecord(users[0], "immunization");

            patchRecord(users[0], "vital_sign");

            patchRecord(users[0], "procedure");
        });

        describe("VERIFIER", () => {
            const patchRecord = (user, key) => {
                it(`should patch ${key} if authenticated`, (done) => {
                    const id = records[2][key][0]._id.toHexString();
                    const body = {
                        value: `new ${key}`
                    };

                    request(app)
                        .patch(`/record/${id}`)
                        .set("x-auth", user.tokens[0].token)
                        .send(body)
                        .expect(200)
                        .expect((res) => {
                            expect(res.body.message).toBe("record updated");
                            expect(res.body.email).toBe(user.email);
                        })
                        .end((err) => {
                            if (err) {
                                done(err);
                            }

                            Record.findOne({ _creator: user._id }).then((record) => {
                                expect(record[key].length).toBe(1);
                                expect(record[key][0].data).toBe(body.value);
                                expect(record[key][0].owner[0].email).toBe(users[0].email);
                                expect(record[key][0].verifier[0].email).toBe(user.email);
                                expect(record[key][0].updatedAt).toBeTruthy();

                                const signOwner = jwt.verify(record[key][0].owner[0].sign, process.env.USER_SECRET);
                                expect(signOwner.owner).toBe(users[0]._id.toHexString());
                                expect(signOwner.record).toBe(records[0]._id.toHexString());
                                expect(signOwner.time).toBeTruthy();

                                const signVerifier = jwt.verify(record[key][0].verifier[0].sign, process.env.USER_SECRET);
                                expect(signVerifier.owner).toBe(user._id.toHexString());
                                expect(signVerifier.record).toBe(record._id.toHexString());
                                expect(signVerifier.time).toBeTruthy();

                                expect(record.log.length).toBe(2);
                                expect(record.log[1].body.key).toBe(id);
                                expect(record.log[1].body.value).toBe(body.value);
                                expect(record.log[1].createdAt).toBeTruthy();

                                done();
                            }).catch(e => done(e));
                        });
                });
            };

            patchRecord(users[2], "allergy");

            patchRecord(users[2], "medication");

            patchRecord(users[2], "problem");

            patchRecord(users[2], "immunization");

            patchRecord(users[2], "vital_sign");

            patchRecord(users[2], "procedure");
        });

        describe("COMMON", () => {
            it("should not patch record element if not authenticated", (done) => {
                const id = records[0].allergy[0]._id;
                const body = {
                    value: "New allergy"
                };

                request(app)
                    .patch(`/record/${id}`)
                    .send(body)
                    .expect(401)
                    .end(done);
            });

            it("should not patch record if userType 'b'", (done) => {
                const id = records[1].allergy[0]._id;
                const body = {
                    value: "New allergy"
                };

                request(app)
                    .patch(`/record/${id}`)
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch record element if request invalid (invalid id)", (done) => {
                const id = "invalid";
                const body = {
                    value: "New allergy"
                };

                request(app)
                    .patch(`/record/${id}`)
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch record element if request invalid (no value)", (done) => {
                const id = records[0].allergy[0]._id;
                const body = {
                    one: "allergy"
                };

                request(app)
                    .patch(`/record/${id}`)
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch record element if request invalid (unknown id)", (done) => {
                const id = records[0]._id;
                const body = {
                    value: "New allergy"
                };

                request(app)
                    .patch(`/record/${id}`)
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });
    });

    describe("EMPTY", () => {
        beforeEach(deleteRecords);

        it("should not patch record element if record not in database", (done) => {
            const id = records[0].allergy[0]._id;
            const body = {
                value: "New allergy"
            };

            request(app)
                .patch(`/record/${id}`)
                .set("x-auth", users[0].tokens[0].token)
                .send(body)
                .expect(404)
                .end(done);
        });
    });
});
