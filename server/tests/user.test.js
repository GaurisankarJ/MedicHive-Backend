// Mocha Test Framework

// Testing with Jest, expect function
const expect = require("expect");
// Testing HTTP via superagent
const request = require("supertest");

// The app for testing
const { app } = require("./../server.js");
// User Model
const { User } = require("./../models/user.js");

// Seed Data
const { users, populateUsers } = require("./seed/seed");

// Testing life-cycle, beforeEach Hook
// Populating Users
beforeEach(populateUsers);

describe("POST /users", () => {
    it("should create user", (done) => {
        const body = {
            email: "example@example.com",
            password: "password123",
            userType: "b"
        };

        request(app)
            .post("/users")
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.header["x-auth"]).toBeTruthy();
                expect(res.body.email).toBe(body.email);
                expect(res.body.userType).toBe(body.userType);
            })
            .end((err) => {
                if (err) {
                    done(err);
                }

                User.findOne({ email: body.email }).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.confirmation).toBeTruthy();
                    expect(user.tokens).toBeTruthy();
                    expect(user.password).not.toBe(body.password);
                    done();
                }).catch(e => done(e));
            });
    });

    it("should not create user if request invalid (no email)", (done) => {
        const body = {
            one: "example",
            password: "password",
            userType: "b"
        };

        request(app)
            .post("/users")
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not create user if request invalid (no password)", (done) => {
        const body = {
            one: "example@example.com",
            two: "password",
            userType: "b"
        };

        request(app)
            .post("/users")
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not create user if request invalid (no userType)", (done) => {
        const body = {
            email: "example@example.com",
            password: "password",
            three: "s"
        };

        request(app)
            .post("/users")
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not create user if request invalid (invalid email)", (done) => {
        const body = {
            email: "example",
            password: "password",
            userType: "b"
        };

        request(app)
            .post("/users")
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not create user if request invalid (invalid password)", (done) => {
        const body = {
            email: "example@example.com",
            password: "pass",
            userType: "b"
        };

        request(app)
            .post("/users")
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not create user if request invalid (invalid userType)", (done) => {
        const body = {
            email: "example@example.com",
            password: "password",
            userType: "x"
        };

        request(app)
            .post("/users")
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not create user if user in database", (done) => {
        const body = {
            email: "seller@example.com",
            password: "userOnePass",
            userType: "s"
        };

        request(app)
            .post("/users")
            .send(body)
            .expect(400)
            .end(done);
    });
});

describe("DELETE /users", () => {
    it("should delete user if authenticated", (done) => {
        request(app)
            .delete("/users")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .end((err) => {
                if (err) {
                    done(err);
                }

                User.findOne({ email: users[0].email }).then((user) => {
                    expect(user).toBeFalsy();
                    done();
                }).catch(e => done(e));
            });
    });

    it("should not delete user if not authenticated", (done) => {
        request(app)
            .delete("/users")
            .expect(401)
            .end(done);
    });
});

describe("PATCH /users", () => {
    it("should patch email if authenticated", (done) => {
        const body = {
            key: "email",
            value: "sellerNew@example.com"
        };

        request(app)
            .patch("/users")
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toBe("email reset");
                expect(res.body.email).toBe(body.value);
            })
            .end((err) => {
                if (err) {
                    done(err);
                }

                User.findOne({ email: body.value }).then((user) => {
                    expect(user).toBeTruthy();
                    done();
                }).catch(e => done(e));
            });
    });

    it("should patch password if authenticated", (done) => {
        const body = {
            key: "password",
            value: "newPassword"
        };

        request(app)
            .patch("/users")
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toBe("password reset");
                expect(res.body.email).toBe(users[0].email);
            })
            .end((err) => {
                if (err) {
                    done(err);
                }

                User.findByCredentials(users[0].email, body.value).then((user) => {
                    expect(user).toBeTruthy();
                    done();
                }).catch(e => done(e));
            });
    });

    it("should not patch user if not authenticated", (done) => {
        const body = {
            key: "email",
            value: "sellerNew@example.com"
        };

        request(app)
            .patch("/users")
            .send(body)
            .expect(401)
            .end(done);
    });

    it("should not patch user if request invalid (no key)", (done) => {
        const body = {
            one: "email",
            value: "seller@example.com"
        };

        request(app)
            .patch("/users")
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not patch user if request invalid (no value)", (done) => {
        const body = {
            key: "email",
            two: "seller@example.com"
        };

        request(app)
            .patch("/users")
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not patch email if email same as saved", (done) => {
        const body = {
            key: "email",
            value: "seller@example.com"
        };

        request(app)
            .patch("/users")
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not patch email if request invalid (invalid email)", (done) => {
        const body = {
            key: "email",
            value: "seller"
        };

        request(app)
            .patch("/users")
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not patch password if password same as saved", (done) => {
        const body = {
            key: "password",
            value: "userOnePass"
        };

        request(app)
            .patch("/users")
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not patch password if request invalid (invalid password)", (done) => {
        const body = {
            key: "password",
            value: "user"
        };

        request(app)
            .patch("/users")
            .set("x-auth", users[0].tokens[0].token)
            .send(body)
            .expect(400)
            .end(done);
    });
});

describe("POST /users/login", () => {
    it("should resolve user", (done) => {
        const body = {
            email: users[1].email,
            password: users[1].password
        };

        request(app)
            .post("/users/login")
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.header["x-auth"]).toBeTruthy();
                expect(res.body.email).toBe(users[1].email);
                expect(res.body.userType).toBe(users[1].userType);
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
                        access: "b-auth",
                        token: res.header["x-auth"]
                    });
                    done();
                }).catch(e => done(e));
            });
    });

    it("should reject user if invalid request (no email)", (done) => {
        const body = {
            one: "one",
            password: "password"
        };

        request(app)
            .post("/users/login")
            .send(body)
            .expect(400)
            .expect((res) => {
                expect(res.header["x-auth"]).toBeFalsy();
            })
            .end((err) => {
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

    it("should reject user if invalid request (no password)", (done) => {
        const body = {
            email: users[1].email,
            two: "two"
        };

        request(app)
            .post("/users/login")
            .send(body)
            .expect(400)
            .expect((res) => {
                expect(res.header["x-auth"]).toBeFalsy();
            })
            .end((err) => {
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

    it("should reject user if request invalid (invalid email)", (done) => {
        const body = {
            email: "exampleOne@abcd.com",
            password: "password"
        };

        request(app)
            .post("/users/login")
            .send(body)
            .expect(404)
            .expect((res) => {
                expect(res.header["x-auth"]).toBeFalsy();
            })
            .end(done);
    });

    it("should reject user if request invalid (invalid password)", (done) => {
        const body = {
            email: users[1].email,
            password: "wrongPassword"
        };

        request(app)
            .post("/users/login")
            .send(body)
            .expect(404)
            .expect((res) => {
                expect(res.header["x-auth"]).toBeFalsy();
            })
            .end((err) => {
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

describe("DELETE /users/logout", () => {
    it("should delete authentication token", (done) => {
        request(app)
            .delete("/users/logout")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.logout).toBe("successful");
            })
            .end((err) => {
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

    it("should not delete authentication token if not authenticated", (done) => {
        request(app)
            .delete("/users/logout")
            .expect(401)
            .end(done);
    });
});

describe("GET /users/confirm", () => {
    it("should activate user", (done) => {
        const { secret } = users[0].confirmation[0];

        request(app)
            .get(`/users/confirm?secret=${secret}`)
            .expect(302)
            .end((err) => {
                if (err) {
                    done(err);
                }

                User.findOne({ _id: users[0]._id }).then((user) => {
                    expect(user.isActive).toBeTruthy();
                    done();
                }).catch(e => done(e));
            });
    });

    it("should not activate user if request invalid (no secret)", (done) => {
        request(app)
            .get("/users/confirm?email=something-invalid")
            .expect(400)
            .end(done);
    });

    it("should not activate user if request invalid (invalid secret)", (done) => {
        const secret = "some secret";

        request(app)
            .get(`/users/confirm?secret=${secret}`)
            .expect(404)
            .end(done);
    });
});

describe("GET /users/forgot", () => {
    it("should send confirmation mail", (done) => {
        const { email } = users[0];

        request(app)
            .get(`/users/forgot?email=${email}`)
            .expect(200)
            .end(done);
    });

    it("should not send confirmation mail if request invalid (no email)", (done) => {
        request(app)
            .get("/users/forgot")
            .expect(400)
            .end(done);
    });

    it("should not send confirmation mail if request invalid (invalid email)", (done) => {
        const { email } = "example@xyz.com";

        request(app)
            .get(`/users/forgot?email=${email}`)
            .expect(404)
            .end(done);
    });
});

describe("POST /users/forgot", () => {
    it("should reset password", (done) => {
        const { secret } = users[0].confirmation[0];
        const body = {
            password: "password",
            confirm: "password"
        };

        request(app)
            .post(`/users/forgot?secret=${secret}`)
            .send(body)
            .expect(302)
            .end((err) => {
                if (err) {
                    done(err);
                }

                User.findByCredentials(users[0].email, body.password).then((user) => {
                    expect(user).toBeTruthy();
                    done();
                }).catch(e => done(e));
            });
    });

    it("should not reset password if request invalid (no secret)", (done) => {
        const body = {
            password: "password",
            confirm: "notpassword"
        };

        request(app)
            .post("/users/forgot?")
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not reset password if request invalid (no password)", (done) => {
        const { secret } = "invalid";
        const body = {
            one: "password",
            confirm: "notpassword"
        };

        request(app)
            .post(`/users/forgot?secret=${secret}`)
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not reset password if request invalid (no confirm)", (done) => {
        const { secret } = "invalid";
        const body = {
            password: "password",
            two: "notpassword"
        };

        request(app)
            .post(`/users/forgot?secret=${secret}`)
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not reset password if request invalid (password and confirm do not match)", (done) => {
        const { secret } = users[0].confirmation[0];
        const body = {
            password: "password",
            confirm: "notpassword"
        };

        request(app)
            .post(`/users/forgot?secret=${secret}`)
            .send(body)
            .expect(400)
            .end(done);
    });

    it("should not reset password if request invalid (invalid secret)", (done) => {
        const { secret } = "secret";
        const body = {
            password: "password",
            confirm: "password"
        };

        request(app)
            .post(`/users/forgot?secret=${secret}`)
            .send(body)
            .expect(404)
            .end(done);
    });
});
