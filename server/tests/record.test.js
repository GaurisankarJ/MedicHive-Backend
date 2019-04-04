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
                        expect(record.log[0].event).toBe("GENESIS");
                        expect(record.log[0].data).toBe("GENESIS");
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
                .end((err) => {
                    if (err) {
                        done(err);
                    }

                    Record.findOne({ _creator: users[0]._id.toHexString() }).then((record) => {
                        expect(record.log.length).toBe(1);
                        expect(record.log[0].event).toBe("GENESIS");
                        expect(record.log[0].data).toBe("GENESIS");
                        expect(record._creator.toHexString()).toBe(users[0]._id.toString());
                        done();
                    }).catch(e => done(e));
                });
        });
    });
});

describe("GET /record", () => {
    describe("POPULATED", () => {
        it("should get record if authenticated", (done) => {
            request(app)
                .get("/record")
                .set("x-auth", users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.email).toBe(users[0].email);
                    expect(res.body.record.allergy[0].data).toBe(records[0].allergy[0].data);
                    expect(res.body.record.medication[0].data).toBe(records[0].medication[0].data);
                    expect(res.body.record.problem[0].data).toBe(records[0].problem[0].data);
                    expect(res.body.record.immunization[0].data).toBe(records[0].immunization[0].data);
                    expect(res.body.record.vital_sign[0].data).toBe(records[0].vital_sign[0].data);
                    expect(res.body.record.procedure[0].data).toBe(records[0].procedure[0].data);
                })
                .end(done);
        });

        it("should not get record if not authenticated", (done) => {
            request(app)
                .get("/record")
                .expect(401)
                .end(done);
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
                                record[key].forEach((rec) => {
                                    expect(rec.isVerified).toBeFalsy();

                                    const owner = jwt.verify(rec.owner[0], process.env.USER_SECRET);
                                    expect(owner.owner).toBe(user._id.toHexString());
                                    expect(owner.record).toBe(record._id.toHexString());
                                });
                                expect(record[key].length).toBe(3);
                                expect(record.log.length).toBe(2);
                                expect(record[key][1].data).toBe(body.value[0]);
                                expect(record[key][2].data).toBe(body.value[1]);
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
                        owner: users[0].email
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
                                record[key].forEach((rec, i) => {
                                    if (i > 0) {
                                        expect(rec.isVerified).toBeTruthy();

                                        const owner = jwt.verify(rec.owner[0], process.env.USER_SECRET);
                                        const verifier = jwt.verify(rec.verifier[0], process.env.USER_SECRET);
                                        expect(owner.owner).toBe(users[0]._id.toHexString());
                                        expect(owner.record).toBe(records[0]._id.toHexString());
                                        expect(verifier.owner).toBe(user._id.toHexString());
                                        expect(verifier.record).toBe(record._id.toHexString());
                                    }
                                });
                                expect(record[key].length).toBe(3);
                                expect(record.log.length).toBe(2);
                                expect(record[key][1].data).toBe(body.value[0]);
                                expect(record[key][2].data).toBe(body.value[1]);
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

            it("should not patch record if request invalid (no owner)", (done) => {
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

            it("should not patch record if request invalid (invalid owner)", (done) => {
                const body = {
                    key: "allergy",
                    value: ["New allergy"],
                    owner: "new@mail.com"
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });

            it("should not patch record if request invalid (invalid owner/userType)", (done) => {
                const body = {
                    key: "allergy",
                    value: ["New allergy"],
                    owner: users[1].email
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
        it("should delete record element if authenticated", (done) => {
            const id = records[0].allergy[0]._id;

            request(app)
                .delete(`/record/${id}`)
                .set("x-auth", users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe("record deleted");
                    expect(res.body.email).toBe(users[0].email);
                })
                .end((err) => {
                    if (err) {
                        done(err);
                    }

                    Record.findOne({ _creator: users[0]._id }).then((record) => {
                        expect(record.deleteByRecordId(id)).toBeFalsy();
                        done();
                    }).catch(e => done(e));
                });
        });

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
            it("should patch record element if authenticated", (done) => {
                const id = records[0].allergy[0]._id;
                const body = {
                    value: "New Allergy"
                };

                request(app)
                    .patch(`/record/${id}`)
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.message).toBe("record updated");
                        expect(res.body.email).toBe(users[0].email);
                    })
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: users[0]._id }).then((record) => {
                            expect(record.allergy.length).toBe(1);
                            expect(record.log.length).toBe(2);
                            expect(record.allergy[0].data).toBe(body.value);
                            expect(record.allergy[0].isVerified).toBeFalsy();
                            done();
                        }).catch(e => done(e));
                    });
            });
        });

        describe("VERIFIER", () => {
            it("should patch record element if authenticated", (done) => {
                const id = records[2].allergy[0]._id;
                const body = {
                    value: "New Allergy"
                };

                request(app)
                    .patch(`/record/${id}`)
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.message).toBe("record updated");
                        expect(res.body.email).toBe(users[2].email);
                    })
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: users[2]._id }).then((record) => {
                            expect(record.allergy.length).toBe(1);
                            expect(record.log.length).toBe(2);
                            expect(record.allergy[0].data).toBe(body.value);
                            expect(record.allergy[0].isVerified).toBeTruthy();
                            done();
                        }).catch(e => done(e));
                    });
            });
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
