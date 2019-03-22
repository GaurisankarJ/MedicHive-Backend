// Mocha Test Framework

// Testing with Jest, expect function
const expect = require("expect");
// Testing HTTP via superagent
const request = require("supertest");

// The app for testing
const { app } = require("./../server.js");
// Record Model
const { Record } = require("../models/record.js");

// Seed Data
const { users, populateUsers, records, deleteRecords, populateRecords } = require("./seed/seed");

// Testing life-cycle, beforeEach Hook
// Populating Users
beforeEach(populateUsers);
// Populating Records
beforeEach(populateRecords);

describe("POST /record", () => {
    describe("TEST I", () => {
        beforeEach(deleteRecords);

        describe("SELLER", () => {
            it("should create record if authenticated", (done) => {
                request(app)
                    .post("/record")
                    .set("x-auth", users[0].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.message).toBe("record created");
                        expect(res.body.email).toBe(users[0].email);
                    })
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: users[0]._id.toHexString() }).then((record) => {
                            expect(record.log[0].event).toBe("GENESIS");
                            expect(record.log[0].data).toBe("GENESIS");
                            expect(record._creator.toHexString()).toBe(users[0]._id.toString());
                            done();
                        }).catch(e => done(e));
                    });
            });
        });

        describe("BUYER", () => {
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
        });

        describe("VERIFIER", () => {
            it("should create record if authenticated", (done) => {
                request(app)
                    .post("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.message).toBe("record created");
                        expect(res.body.email).toBe(users[2].email);
                    })
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: users[2]._id.toHexString() }).then((record) => {
                            expect(record.log[0].event).toBe("GENESIS");
                            expect(record.log[0].data).toBe("GENESIS");
                            expect(record._creator.toHexString()).toBe(users[2]._id.toString());
                            done();
                        }).catch(e => done(e));
                    });
            });
        });

        describe("COMMON", () => {
            it("should not create record if not authenticated", (done) => {
                request(app)
                    .post("/record")
                    .expect(401)
                    .end(done);
            });
        });
    });
    describe("TEST II", () => {
        describe("SELLER", () => {
            it("should not create record if record already exists", (done) => {
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

        describe("BUYER", () => {
            it("should not create record if record already exists", (done) => {
                request(app)
                    .post("/record")
                    .set("x-auth", users[1].tokens[0].token)
                    .expect(400)
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: users[1]._id.toHexString() }).then((record) => {
                            expect(record.log.length).toBe(1);
                            expect(record.log[0].event).toBe("GENESIS");
                            expect(record.log[0].data).toBe("GENESIS");
                            expect(record._creator.toHexString()).toBe(users[1]._id.toString());
                            done();
                        }).catch(e => done(e));
                    });
            });
        });

        describe("VERIFIER", () => {
            it("should not create record if record already exists", (done) => {
                request(app)
                    .post("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .expect(400)
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: users[2]._id.toHexString() }).then((record) => {
                            expect(record.log.length).toBe(1);
                            expect(record.log[0].event).toBe("GENESIS");
                            expect(record.log[0].data).toBe("GENESIS");
                            expect(record._creator.toHexString()).toBe(users[2]._id.toString());
                            done();
                        }).catch(e => done(e));
                    });
            });
        });
    });
});

describe("GET /record", () => {
    describe("TEST I", () => {
        describe("SELLER", () => {
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
        });

        describe("BUYER", () => {
            it("should get record if authenticated", (done) => {
                request(app)
                    .get("/record")
                    .set("x-auth", users[1].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.email).toBe(users[1].email);
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
                        expect(res.body.record.medication[0].data).toBe(records[2].medication[0].data);
                        expect(res.body.record.problem[0].data).toBe(records[2].problem[0].data);
                        expect(res.body.record.immunization[0].data).toBe(records[2].immunization[0].data);
                        expect(res.body.record.vital_sign[0].data).toBe(records[2].vital_sign[0].data);
                        expect(res.body.record.procedure[0].data).toBe(records[2].procedure[0].data);
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

    describe("TEST II", () => {
        beforeEach(deleteRecords);

        describe("SELLER", () => {
            it("should not get record if record not in database", (done) => {
                request(app)
                    .get("/record")
                    .set("x-auth", users[0].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });

        describe("BUYER", () => {
            it("should not get record if record not in database", (done) => {
                request(app)
                    .get("/record")
                    .set("x-auth", users[1].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            it("should not get record if record not in database", (done) => {
                request(app)
                    .get("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });
    });
});

describe("DELETE /record", () => {
    describe("TEST I", () => {
        describe("SELLER", () => {
            it("should delete record if authenticated", (done) => {
                request(app)
                    .delete("/record")
                    .set("x-auth", users[0].tokens[0].token)
                    .expect(200)
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: users[0]._id }).then((record) => {
                            expect(record).toBeFalsy();
                            done();
                        }).catch(e => done(e));
                    });
            });
        });

        describe("BUYER", () => {
            it("should delete record if authenticated", (done) => {
                request(app)
                    .delete("/record")
                    .set("x-auth", users[1].tokens[0].token)
                    .expect(200)
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        Record.findOne({ _creator: users[1]._id }).then((record) => {
                            expect(record).toBeFalsy();
                            done();
                        }).catch(e => done(e));
                    });
            });
        });

        describe("VERIFIER", () => {
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
        });

        describe("COMMON", () => {
            it("should not delete record if not authenticated", (done) => {
                request(app)
                    .delete("/record")
                    .expect(401)
                    .end(done);
            });
        });
    });

    describe("TEST II", () => {
        beforeEach(deleteRecords);

        describe("SELLER", () => {
            it("should not delete record if record not in database", (done) => {
                request(app)
                    .delete("/record")
                    .set("x-auth", users[0].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });

        describe("BUYER", () => {
            it("should not delete record if record not in database", (done) => {
                request(app)
                    .delete("/record")
                    .set("x-auth", users[1].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            it("should not delete record if record not in database", (done) => {
                request(app)
                    .delete("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });
    });
});

describe("PATCH /record", () => {
    describe("TEST I", () => {
        const patchRecord = (user, key, n, m) => {
            it(`should patch ${key} if authenticated`, (done) => {
                const body = {
                    key,
                    value: "New value"
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
                            expect(record[key].length).toBe(n);
                            expect(record.log.length).toBe(2);
                            expect(record[key][m].data).toBe(body.value);
                            done();
                        }).catch(e => done(e));
                    });
            });
        };
        describe("SELLER", () => {
            patchRecord(users[0], "allergy", 2, 1);

            patchRecord(users[0], "medication", 2, 1);

            patchRecord(users[0], "problem", 2, 1);

            patchRecord(users[0], "immunization", 2, 1);

            patchRecord(users[0], "vital_sign", 2, 1);

            patchRecord(users[0], "procedure", 2, 1);
        });

        describe("BUYER", () => {
            patchRecord(users[1], "allergy", 1, 0);

            patchRecord(users[1], "medication", 1, 0);

            patchRecord(users[1], "problem", 1, 0);

            patchRecord(users[1], "immunization", 1, 0);

            patchRecord(users[1], "vital_sign", 1, 0);

            patchRecord(users[1], "procedure", 1, 0);
        });

        describe("VERIFIER", () => {
            patchRecord(users[2], "allergy", 2, 1);

            patchRecord(users[2], "medication", 2, 1);

            patchRecord(users[2], "problem", 2, 1);

            patchRecord(users[2], "immunization", 2, 1);

            patchRecord(users[2], "vital_sign", 2, 1);

            patchRecord(users[2], "procedure", 2, 1);
        });

        describe("COMMON", () => {
            it("should not patch record if not authenticated", (done) => {
                const body = {
                    key: "allergy",
                    value: "New allergy"
                };

                request(app)
                    .patch("/record")
                    .send(body)
                    .expect(401)
                    .end(done);
            });

            it("should not patch record if request invalid (no key)", (done) => {
                const body = {
                    one: "allergy",
                    value: "New allergy"
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch record if request invalid (no value)", (done) => {
                const body = {
                    key: "allergy",
                    two: "New allergy"
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch record if request invalid (invalid key)", (done) => {
                const body = {
                    key: "none",
                    value: "New allergy"
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        });
    });

    describe("TEST II", () => {
        beforeEach(deleteRecords);
        describe("SELLER", () => {
            it("should not patch record if record not in database", (done) => {
                const body = {
                    key: "allergy",
                    value: "New allergy"
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });

        describe("BUYER", () => {
            it("should not patch record if record not in database", (done) => {
                const body = {
                    key: "allergy",
                    value: "New allergy"
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            it("should not patch record if record not in database", (done) => {
                const body = {
                    key: "allergy",
                    value: "New allergy"
                };

                request(app)
                    .patch("/record")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });
    });
});
