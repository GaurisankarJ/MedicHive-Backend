const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Record } = require("./../models/record");
const { User } = require("./../models/user");
const { records, populateRecords, users, populateUsers } = require("./seed/seed");

//Testing life-cycle
beforeEach(populateUsers);
beforeEach(populateRecords);

describe("GET /users/me", () => {
    it("should return user if authenticated", (done) => {
        request(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token)//To set headers
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
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

describe("POST /users", () => {
    it("should create a user", (done) => {
        var email = "example@example.com";
        var password = "password123";

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
                    return done(err);
                }

                User.findOne({ email }).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((err) => done(err));
            });
    });

    it("should return validation errors if request invalid", (done) => {
        var email = "sankar";
        var password = "pass";
        request(app)
            .post("/users")
            .send({ email, password })
            .expect(400)
            .end(done);
    });

    it("should not create user if email in use", (done) => {
        var email = "sankar@example.com";
        var password = "userOnePass";
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
                        done()
                    }

                    expect(user.toObject().tokens[1]).toMatchObject({
                        access: "auth",
                        token: res.header["x-auth"]
                    });
                    done();
                }).catch((err) => done(err));
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
                        done()
                    }
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((err) => done(err));
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
                }).catch((err) => done(err));
            });
    });
});

describe("POST /records", () => {
    it("should create a new record", (done) => {
        var body = {
            disease: "Disease",
            medication: "Medication",
            doctor: "Doctor"
        };
        request(app)
            .post("/records")
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect((res) => {
                console.log(res.body.disease);
                expect(res.body.disease).toBe(body.disease);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Record.find({ disease: body.disease }).then((records) => {
                    expect(records.length).toBe(3);
                    expect(records[0].disease).toBe(body.disease);
                    done();
                }).catch((err) => done(err));
            });
    });

    it("should not create record with invalid body data", (done) => {
        request(app)
            .post("/records")
            .send({})
            .set("x-auth", users[0].tokens[0].token)
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Record.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            });
    });
});

describe("GET /records", () => {
    it("should get all records", (done) => {
        request(app)
            .get("/records")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.records.length).toBe(1);
            })
            .end(done);
    });
});


describe("DELETE /records/:id", () => {
    it("should remove a record", (done) => {
        var hexID = records[1]._id.toHexString();
        request(app)
            .delete(`/records/${hexID}`)
            .set("x-auth", users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.record._id).toBe(hexID);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Record.findById(hexID).then((record) => {
                    expect(record).toBeFalsy();
                    done();
                }).catch((err) => done(err));
            });
    });

    it("should not remove a record created by other user", (done) => {
        var hexID = records[0]._id.toHexString();
        request(app)
            .delete(`/records/${hexID}`)
            .set("x-auth", users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Record.findById(hexID).then((record) => {
                    expect(record).toBeTruthy();
                    done();
                }).catch((err) => done(err));
            });
    });

    it("should return 404 if record not found", (done) => {
        var hexID = new ObjectID().toHexString();
        request(app)
            .delete(`/records/${hexID}`)
            .set("x-auth", users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("should return 404 if object ID is invalid", (done) => {
        request(app)
            .delete("/records/123")
            .set("x-auth", users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe("PATCH /records/:id", () => {
    it("should update the record", (done) => {
        var hexID = records[0]._id.toHexString();
        var body = {
            disease: "Updated disease",
            medication: "Updated medication",
            doctor: "Updated doctor",
        };
        request(app)
            .patch(`/records/${hexID}`)
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.record.disease).toBe(body.disease);
                expect(res.body.record.medication).toBe(body.medication);
                expect(res.body.record.doctor).toBe(body.doctor);
            })
            .end(done);
    });

    it("should not update the record created by other user", (done) => {
        var hexID = records[1]._id.toHexString();
        var body = {
            disease: "Updated disease",
            medication: "Updated medication",
            doctor: "Updated doctor",
        };
        request(app)
            .patch(`/records/${hexID}`)
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(404)
            .end(done);
    });
});