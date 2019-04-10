// Mocha Test Framework

// Testing with Jest, expect function
const expect = require("expect");
// Testing HTTP via superagent
const request = require("supertest");

// The app for testing
const { app } = require("../server.js");
// UserData Model
const { UserData } = require("../models/userData.js");

// Seed Data
const { users, populateUsers, userData, deleteUserData, populateUserData, populateActivatedUsers, populateDeactivatedUsers } = require("./seed/seed");

// Testing life-cycle, beforeEach Hook
// Populating Users
beforeEach(populateUsers);
// Populating User Data
beforeEach(populateUserData);

describe("POST /users/me", () => {
    describe("EMPTY", () => {
        beforeEach(deleteUserData);

        describe("SELLER", () => {
            it("should create userData if authenticated", (done) => {
                const body = {
                    name: "example",
                    address: "example address",
                    seller: {
                        age: 24,
                        weight: 130,
                        sex: "female",
                        occupation: "job"
                    }
                };

                request(app)
                    .post("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.email).toBe(users[0].email);
                        expect(res.body.message).toBe("user created");
                    })
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        UserData.findOne({ _creator: users[0]._id }).then((details) => {
                            expect(details.name).toBe(body.name);
                            expect(details.address).toBe(body.address);
                            expect(details.seller.age).toBe(body.seller.age);
                            expect(details.seller.weight).toBe(body.seller.weight);
                            expect(details.seller.sex).toBe(body.seller.sex);
                            expect(details.seller.occupation).toBe(body.seller.occupation);
                            done();
                        }).catch(e => done(e));
                    });
            });

            it("should not create userData if request invalid (invalid seller)", (done) => {
                const body = {
                    name: "example",
                    address: "example address",
                    seller: {
                        name: "name",
                        address: "address"
                    }
                };

                request(app)
                    .post("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        });

        describe("BUYER", () => {
            it("should create userData if authenticated", (done) => {
                const body = {
                    name: "example",
                    address: "example address"
                };

                request(app)
                    .post("/users/me")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.email).toBe(users[1].email);
                        expect(res.body.message).toBe("user created");
                    })
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        UserData.findOne({ _creator: users[1]._id }).then((details) => {
                            expect(details.name).toBe(body.name);
                            expect(details.address).toBe(body.address);
                            done();
                        }).catch(e => done(e));
                    });
            });
        });

        describe("VERIFIER", () => {
            it("should create userData if authenticated", (done) => {
                const body = {
                    name: "example",
                    address: "example address"
                };

                request(app)
                    .post("/users/me")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.email).toBe(users[2].email);
                        expect(res.body.message).toBe("user created");
                    })
                    .end((err) => {
                        if (err) {
                            done(err);
                        }

                        UserData.findOne({ _creator: users[2]._id }).then((details) => {
                            expect(details.name).toBe(body.name);
                            expect(details.address).toBe(body.address);
                            done();
                        }).catch(e => done(e));
                    });
            });
        });

        describe("COMMON", () => {
            it("should not create userData if not authenticated", (done) => {
                const body = {
                    name: "example",
                    address: "example address"
                };

                request(app)
                    .post("/users/me")
                    .send(body)
                    .expect(401)
                    .end(done);
            });

            it("should not create userData if request invalid (no name)", (done) => {
                const body = {
                    one: "example",
                    address: "example address"
                };

                request(app)
                    .post("/users/me")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not create userData if request invalid (no address)", (done) => {
                const body = {
                    name: "example",
                    two: "example address"
                };

                request(app)
                    .post("/users/me")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        });
    });

    describe("POPULATED", () => {
        describe("SELLER", () => {
            it("should not create userData if userData in database", (done) => {
                const body = {
                    name: "example",
                    address: "example address",
                    seller: {
                        age: 24,
                        weight: 130,
                        sex: "female",
                        occupation: "job"
                    }
                };

                request(app)
                    .post("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        });

        describe("BUYER", () => {
            it("should not create userData if userData in database", (done) => {
                const body = {
                    name: "example",
                    address: "example address",
                    seller: {
                        age: 24,
                        weight: 130,
                        sex: "female",
                        occupation: "job"
                    }
                };

                request(app)
                    .post("/users/me")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            it("should not create userData if userData in database", (done) => {
                const body = {
                    name: "example",
                    address: "example address",
                    seller: {
                        age: 24,
                        weight: 130,
                        sex: "female",
                        occupation: "job"
                    }
                };

                request(app)
                    .post("/users/me")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        });
    });
});

describe("GET /users/me", () => {
    describe("POPULATED", () => {
        describe("SELLER", () => {
            it("should get userData if authenticated", (done) => {
                request(app)
                    .get("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.email).toBe(users[0].email);
                        expect(res.body.userData.name).toBe(userData[0].name);
                        expect(res.body.userData.address).toBe(userData[0].address);
                        expect(res.body.userData.userType).toBe(userData[0].userType);
                        expect(res.body.userData.seller.age).toBe(userData[0].seller.age);
                        expect(res.body.userData.seller.weight).toBe(userData[0].seller.weight);
                        expect(res.body.userData.seller.sex).toBe(userData[0].seller.sex);
                        expect(res.body.userData.seller.occupation).toBe(userData[0].seller.occupation);
                    })
                    .end(done);
            });
        });

        describe("BUYER", () => {
            it("should get userData if authenticated", (done) => {
                request(app)
                    .get("/users/me")
                    .set("x-auth", users[1].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.email).toBe(users[1].email);
                        expect(res.body.userData.name).toBe(userData[1].name);
                        expect(res.body.userData.address).toBe(userData[1].address);
                        expect(res.body.userData.userType).toBe(userData[1].userType);
                    })
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            it("should get userData if authenticated", (done) => {
                request(app)
                    .get("/users/me")
                    .set("x-auth", users[2].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.email).toBe(users[2].email);
                        expect(res.body.userData.name).toBe(userData[2].name);
                        expect(res.body.userData.address).toBe(userData[2].address);
                        expect(res.body.userData.userType).toBe(userData[2].userType);
                    })
                    .end(done);
            });
        });

        describe("COMMON", () => {
            it("should not get userData if not authenticated", (done) => {
                request(app)
                    .get("/users/me")
                    .expect(401)
                    .end(done);
            });
        });
    });

    describe("EMPTY", () => {
        beforeEach(deleteUserData);

        describe("SELLER", () => {
            it("should not get userData if userData not in database", (done) => {
                request(app)
                    .get("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });

        describe("BUYER", () => {
            it("should not get userData if userData not in database", (done) => {
                request(app)
                    .get("/users/me")
                    .set("x-auth", users[1].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            it("should not get userData if userData not in database", (done) => {
                request(app)
                    .get("/users/me")
                    .set("x-auth", users[2].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });
    });
});

describe("DELETE /users/me", () => {
    describe("POPULATED", () => {
        describe("SELLER", () => {
            it("should delete userData if authenticated", (done) => {
                request(app)
                    .delete("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .expect(200)
                    .end(done);
            });
        });

        describe("BUYER", () => {
            it("should delete userData if authenticated", (done) => {
                request(app)
                    .delete("/users/me")
                    .set("x-auth", users[1].tokens[0].token)
                    .expect(200)
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            it("should delete userData if authenticated", (done) => {
                request(app)
                    .delete("/users/me")
                    .set("x-auth", users[2].tokens[0].token)
                    .expect(200)
                    .end(done);
            });
        });

        describe("COMMON", () => {
            it("should not delete userData if not authenticated", (done) => {
                request(app)
                    .delete("/users/me")
                    .expect(401)
                    .end(done);
            });
        });
    });

    describe("EMPTY", () => {
        beforeEach(deleteUserData);

        describe("SELLER", () => {
            it("should not delete userData if userData not in database", (done) => {
                request(app)
                    .delete("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });

        describe("BUYER", () => {
            it("should not delete userData if userData not in database", (done) => {
                request(app)
                    .delete("/users/me")
                    .set("x-auth", users[1].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            it("should not delete userData if userData not in database", (done) => {
                request(app)
                    .delete("/users/me")
                    .set("x-auth", users[2].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
        });
    });
});

describe("PATCH /users/me", () => {
    const patchUser = (user, key, value) => {
        it(`should patch ${key} if authenticated`, (done) => {
            const body = { key, value };

            request(app)
                .patch("/users/me")
                .set("x-auth", user.tokens[0].token)
                .send(body)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe(`${key} updated`);
                    expect(res.body.email).toBe(user.email);
                })
                .end((err) => {
                    if (err) {
                        done(err);
                    }

                    if (key === "name" || key === "address") {
                        UserData.findOne({ _creator: user._id }).then((details) => {
                            expect(details[key]).toBe(value);
                            done();
                        }).catch(e => done(e));
                    } else if (user.userType === "b") {
                        UserData.findOne({ _creator: user._id }).then((details) => {
                            expect(details.buyer[key]).toBe(value);
                            expect(details.seller[key]).toBeFalsy();
                            expect(details.verifier[key]).toBeFalsy();
                            done();
                        }).catch(e => done(e));
                    } else if (user.userType === "s") {
                        UserData.findOne({ _creator: user._id }).then((details) => {
                            expect(details.seller[key]).toBe(value);
                            expect(details.buyer[key]).toBeFalsy();
                            expect(details.verifier[key]).toBeFalsy();
                            done();
                        }).catch(e => done(e));
                    } else if (user.userType === "v") {
                        UserData.findOne({ _creator: user._id }).then((details) => {
                            expect(details.verifier[key]).toBe(value);
                            expect(details.buyer[key]).toBeFalsy();
                            expect(details.seller[key]).toBeFalsy();
                            done();
                        }).catch(e => done(e));
                    }
                });
        });
    };

    describe("POPULATED", () => {
        describe("SELLER", () => {
            patchUser(users[0], "name", "new name");

            patchUser(users[0], "address", "new address");

            patchUser(users[0], "age", 26);

            patchUser(users[0], "weight", 55);

            patchUser(users[0], "sex", "male");

            patchUser(users[0], "occupation", "new job");

            it("should not patch userData if request invalid (invalid age)", (done) => {
                const body = {
                    key: "age",
                    value: -3
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch userData if request invalid (invalid weight)", (done) => {
                const body = {
                    key: "weight",
                    value: -2
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch userData if request invalid (invalid sex)", (done) => {
                const body = {
                    key: "sex",
                    value: "invalid"
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        });

        describe("BUYER", () => {
            patchUser(users[1], "name", "new name");

            patchUser(users[1], "address", "new address");

            patchUser(users[1], "bio", "new bio");
        });

        describe("VERIFIER", () => {
            patchUser(users[2], "name", "new name");

            patchUser(users[2], "address", "new address");

            patchUser(users[2], "bio", "new bio");
        });

        describe("COMMON", () => {
            it("should not patch userData if not authenticated", (done) => {
                const body = {
                    key: "new field",
                    value: "new update"
                };

                request(app)
                    .patch("/users/me")
                    .send(body)
                    .expect(401)
                    .end(done);
            });

            it("should not patch userData if request invalid (no key)", (done) => {
                const body = {
                    one: "field",
                    value: "new update"
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch userData if request invalid (invalid key)", (done) => {
                const body = {
                    key: "none",
                    value: "update"
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch userData if request invalid (no value)", (done) => {
                const body = {
                    key: "new field",
                    two: "update"
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        });
    });

    describe("EMPTY", () => {
        beforeEach(deleteUserData);

        describe("SELLER", () => {
            it("should not patch userData if userData not in database", (done) => {
                const body = {
                    key: "name",
                    value: "new update"
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });

        describe("BUYER", () => {
            it("should not patch userData if userData not in database", (done) => {
                const body = {
                    key: "name",
                    value: "new update"
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });

        describe("VERIFIER", () => {
            it("should not patch userData if userData not in database", (done) => {
                const body = {
                    key: "name",
                    value: "new update"
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(404)
                    .end(done);
            });
        });
    });
});

describe("GET /message/me", () => {
    describe("POPULATED", () => {
        it("should get message if authenticated", (done) => {
            request(app)
                .get("/message/me")
                .set("x-auth", users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.email).toBe(users[0].email);
                    expect(Object.keys(res.body).length).toBe(3);
                })
                .end(done);
        });

        it("should not get message if not authenticated", (done) => {
            request(app)
                .get("/message/me")
                .expect(401)
                .end(done);
        });
    });

    describe("NOT ACTIVATED", () => {
        beforeEach(populateDeactivatedUsers);
        afterEach(populateActivatedUsers);

        it("should not get message if authenticated, not activated", (done) => {
            request(app)
                .get("/message/me")
                .expect(401)
                .end(done);
        });
    });

    describe("EMPTY", () => {
        beforeEach(deleteUserData);

        it("should not get message if userData not in database", (done) => {
            request(app)
                .get("/message/me")
                .set("x-auth", users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });
});
