const expect = require("expect");
const request = require("supertest");
const _ = require("lodash");

const { app } = require("./../server");
const { Record } = require("./../models/record");
const { User } = require("./../models/user");
const { users, populateUsers, userDetails, populateUserDetails, records, populateRecords } = require("./seed/seed");

// Testing life-cycle
beforeEach(populateUsers);
beforeEach(populateRecords);
beforeEach(populateUserDetails);

describe("POST /users", () => {
    it("should create a user", (done) => {
        const email = "example@example.com";
        const password = "password123";

        request(app)
            .post("/users")
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.header["x-auth"]).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    done(err);
                }

                User.findOne({ email }).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch(e => done(e));
            });
    });

    it("should return validation errors if request invalid", (done) => {
        const email = "sankar";
        const password = "pass";
        request(app)
            .post("/users")
            .send({ email, password })
            .expect(400)
            .end(done);
    });

    it("should not create user if email in use", (done) => {
        const email = "sankar@example.com";
        const password = "userOnePass";
        request(app)
            .post("/users")
            .send({ email, password })
            .expect(400)
            .end(done);
    });
});

describe("POST /users/login", () => {
    it("should login user and return auth token", (done) => {
        request(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.header["x-auth"]).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                User.findOne({ email: res.body.email }).then((user) => {
                    if (!user) {
                        done();
                    }

                    expect(user.toObject().tokens[1]).toMatchObject({
                        access: "auth",
                        token: res.header["x-auth"]
                    });
                    done();
                }).catch(e => done(e));
            });
    });

    it("should reject invalid login", (done) => {
        request(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: "wrong_password"
            })
            .expect(400)
            .expect((res) => {
                expect(res.header["x-auth"]).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    if (!user) {
                        done();
                    }
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe("DELETE /users/me/token", () => {
    it("should remove auth token on logout", (done) => {
        request(app)
            .delete("/users/me/token")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    if (!user) {
                        done();
                    }
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe("POST /users/me", () => {
    it("should return user id if authenticated", (done) => {
        request(app)
            .post("/users/me")
            .send(userDetails[0])
            .set("x-auth", users[0].tokens[0].token)// To set headers
            .expect(200)
            .expect((res) => {
                expect(res.body).toBe(users[0]._id.toHexString());
            })
            .end(done);
    });

    it("should return 400 if age is missing", (done) => {
        request(app)
            .post("/users/me")
            .send(_.pick(userDetails[0], ["weight", "sex"]))
            .set("x-auth", users[0].tokens[0].token)
            .expect(400)
            .end(done);
    });

    it("should return 400 if weight is missing", (done) => {
        request(app)
            .post("/users/me")
            .send(_.pick(userDetails[0], ["age", "sex"]))
            .set("x-auth", users[0].tokens[0].token)
            .expect(400)
            .end(done);
    });

    it("should return 400 if sex is missing", (done) => {
        request(app)
            .post("/users/me")
            .send(_.pick(userDetails[0], ["age", "weight"]))
            .set("x-auth", users[0].tokens[0].token)
            .expect(400)
            .end(done);
    });

    it("should return 401 if not authenticated", (done) => {
        request(app)
            .post("/users/me")
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe("GET /users/me", () => {
    it("should return user details if authenticated", (done) => {
        request(app)
            .get("/users/me")
            .set("x-auth", users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.user).toBe(users[1]._id.toHexString());
                expect(res.body.userDetails.age).toBe(23);
                expect(res.body.userDetails.weight).toBe(101);
                expect(res.body.userDetails.sex).toBe("female");
            })
            .end(done);
    });

    it("should not return user details of other user", (done) => {
        request(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

    it("should return 401 if not authenticated", (done) => {
        request(app)
            .get("/users/me")
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe("PATCH /users/me", () => {
    it("should return user id if authenticated", (done) => {
        const body = {
            age: 23,
            weight: 15
        };
        request(app)
            .patch("/users/me")
            .send(body)
            .set("x-auth", users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body).toBe(users[1]._id.toHexString());
            })
            .end(done);
    });

    it("should not patch user details of user with no user details posted", (done) => {
        request(app)
            .patch("/users/me")
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

    it("should return 401 if not authenticated", (done) => {
        request(app)
            .patch("/users/me")
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe("POST /record", () => {
    it("should create a new record", (done) => {
        request(app)
            .post("/record")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._creator).toBe(users[0]._id.toHexString());
                expect(res.body).toMatchObject({
                    allergy: [],
                    medication: [],
                    problem: [],
                    immunization: [],
                    vital_sign: [],
                    procedure: [],
                    log: []
                });
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                Record.find({ _creator: users[0]._id.toHexString() }).then((record) => {
                    expect(record.length).toBe(2);
                    expect(record[1].allergy[0]).toBe(undefined);
                    expect(record[1].medication[0]).toBe(undefined);
                    expect(record[1].problem[0]).toBe(undefined);
                    expect(record[1].immunization[0]).toBe(undefined);
                    expect(record[1].vital_sign[0]).toBe(undefined);
                    expect(record[1].procedure[0]).toBe(undefined);
                    expect(record[1].log[0]).toBe(undefined);
                    done();
                }).catch(e => done(e));
            });
    });

    it("should return 401 if not authenticated", (done) => {
        request(app)
            .post("/record")
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe("GET /record", () => {
    it("should get all records", (done) => {
        request(app)
            .get("/record")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.record[0]._creator).toBe(users[0]._id.toHexString());
                expect(res.body.record[0].allergy[0]).toBe("Allergy");
                expect(res.body.record[0].medication[0]).toBe("Medication");
                expect(res.body.record[0].problem[0]).toBe("Problem");
                expect(res.body.record[0].immunization[0]).toBe("Immunization");
                expect(res.body.record[0].vital_sign[0]).toBe("Vital Sign");
                expect(res.body.record[0].procedure[0]).toBe("Procedure");
                expect(res.body.record[0].log[0]).toBe("LOG");
                expect(res.body.record.length).toBe(1);
            })
            .end(done);
    });

    it("should return 401 if not authenticated", (done) => {
        request(app)
            .get("/record")
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe("PATCH /record", () => {
    const hexID = records[0]._id.toHexString();
    it("should update the record", (done) => {
        const body = {
            type: "allergy",
            record: "New Allergy"
        };
        request(app)
            .patch("/record")
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.enteredAt).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                Record.findById(hexID).then((record) => {
                    expect(record.allergy.length).toBe(2);
                    expect(record.allergy[1]).toBe("New Allergy");
                    done();
                }).catch(e => done(e));
            });
    });

    it("should return 404 if record not found", (done) => {
        request(app)
            .patch("/record")
            .set("x-auth", users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe("DELETE /record", () => {
    it("should remove a record", (done) => {
        const hexID = records[0]._id.toHexString();
        request(app)
            .delete("/record")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                Record.findById(hexID).then((record) => {
                    expect(record).toBeFalsy();
                    done();
                }).catch(e => done(e));
            });
    });


    it("should return 404 if record not found", (done) => {
        request(app)
            .delete("/record")
            .set("x-auth", users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe("GET /downloads", () => {
    it("should return an array", (done) => {
        request(app)
            .get("/downloads")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body).toBeTruthy();
            })
            .end(done);
    });

    it("should not not return documents if not authenticated", (done) => {
        request(app)
            .get("/downloads")
            .expect(401)
            .end(done);
    });
});
