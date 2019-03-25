// Mocha Test Framework

// Testing with Jest, expect function
const expect = require("expect");
// Testing HTTP via superagent
const request = require("supertest");

// The app for testing
const { app } = require("../server.js");
// UserDetail Model
const { UserDetail } = require("../models/userDetail.js");

// Seed Data
const { users, populateUsers, userDetails, deleteUserDetails, populateUserDetails } = require("./seed/seed");

// Testing life-cycle, beforeEach Hook
// Populating Users
beforeEach(populateUsers);
// Populating User Details
beforeEach(populateUserDetails);

// describe("POST /users/me", () => {
//     describe("TEST I", () => {
//         beforeEach(deleteUserDetails);

//         describe("SELLER", () => {
//             it("should create userDetail if authenticated", (done) => {
//                 const body = {
//                     name: "example",
//                     address: "example address",
//                     seller: {
//                         age: 24,
//                         weight: 130,
//                         sex: "female",
//                         occupation: "job"
//                     }
//                 };

//                 request(app)
//                     .post("/users/me")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .send(body)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.email).toBe(users[0].email);
//                         expect(res.body.message).toBe("user created");
//                     })
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }
//                         UserDetail.findOne({ _creator: users[0]._id }).then((details) => {
//                             expect(details.name).toBe(body.name);
//                             expect(details.address).toBe(body.address);
//                             expect(details.seller.age).toBe(body.seller.age);
//                             expect(details.seller.weight).toBe(body.seller.weight);
//                             expect(details.seller.sex).toBe(body.seller.sex);
//                             expect(details.seller.occupation).toBe(body.seller.occupation);
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });

//             it("should not create userDetail if request invalid (invalid seller)", (done) => {
//                 const body = {
//                     name: "example",
//                     address: "example address",
//                     seller: {
//                         name: "name",
//                         address: "address"
//                     }
//                 };

//                 request(app)
//                     .post("/users/me")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });
//         });

//         describe("BUYER", () => {
//             it("should create userDetail if authenticated", (done) => {
//                 const body = {
//                     name: "example",
//                     address: "example address"
//                 };

//                 request(app)
//                     .post("/users/me")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .send(body)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.email).toBe(users[1].email);
//                         expect(res.body.message).toBe("user created");
//                     })
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         UserDetail.findOne({ _creator: users[1]._id }).then((details) => {
//                             expect(details.name).toBe(body.name);
//                             expect(details.address).toBe(body.address);
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should create userDetail if authenticated", (done) => {
//                 const body = {
//                     name: "example",
//                     address: "example address"
//                 };

//                 request(app)
//                     .post("/users/me")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .send(body)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.email).toBe(users[2].email);
//                         expect(res.body.message).toBe("user created");
//                     })
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         UserDetail.findOne({ _creator: users[2]._id }).then((details) => {
//                             expect(details.name).toBe(body.name);
//                             expect(details.address).toBe(body.address);
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         });

//         describe("COMMON", () => {
//             it("should not create userDetail if not authenticated", (done) => {
//                 const body = {
//                     name: "example",
//                     address: "example address"
//                 };

//                 request(app)
//                     .post("/users/me")
//                     .send(body)
//                     .expect(401)
//                     .end(done);
//             });

//             it("should not create userDetail if request invalid (no name)", (done) => {
//                 const body = {
//                     one: "example",
//                     address: "example address"
//                 };

//                 request(app)
//                     .post("/users/me")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });

//             it("should not create userDetail if request invalid (no address)", (done) => {
//                 const body = {
//                     name: "example",
//                     two: "example address"
//                 };

//                 request(app)
//                     .post("/users/me")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });
//         });
//     });

//     describe("TEST II", () => {
//         describe("SELLER", () => {
//             it("should not create userDetail if userDetail in database", (done) => {
//                 const body = {
//                     name: "example",
//                     address: "example address",
//                     seller: {
//                         age: 24,
//                         weight: 130,
//                         sex: "female",
//                         occupation: "job"
//                     }
//                 };

//                 request(app)
//                     .post("/users/me")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });
//         });

//         describe("BUYER", () => {
//             it("should not create userDetail if userDetail in database", (done) => {
//                 const body = {
//                     name: "example",
//                     address: "example address",
//                     seller: {
//                         age: 24,
//                         weight: 130,
//                         sex: "female",
//                         occupation: "job"
//                     }
//                 };

//                 request(app)
//                     .post("/users/me")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should not create userDetail if userDetail in database", (done) => {
//                 const body = {
//                     name: "example",
//                     address: "example address",
//                     seller: {
//                         age: 24,
//                         weight: 130,
//                         sex: "female",
//                         occupation: "job"
//                     }
//                 };

//                 request(app)
//                     .post("/users/me")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });
//         });
//     });
// });

// describe("GET /users/me", () => {
//     describe("TEST I", () => {
//         describe("SELLER", () => {
//             it("should get userDetail if authenticated", (done) => {
//                 request(app)
//                     .get("/users/me")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.userType).toBe(users[0].userType);
//                         expect(res.body.userDetail.name).toBe(userDetails[0].name);
//                         expect(res.body.userDetail.address).toBe(userDetails[0].address);
//                         expect(res.body.userDetail.seller.age).toBe(userDetails[0].seller.age);
//                         expect(res.body.userDetail.seller.weight).toBe(userDetails[0].seller.weight);
//                         expect(res.body.userDetail.seller.sex).toBe(userDetails[0].seller.sex);
//                         expect(res.body.userDetail.seller.occupation).toBe(userDetails[0].seller.occupation);
//                     })
//                     .end(done);
//             });
//         });

//         describe("BUYER", () => {
//             it("should get userDetail if authenticated", (done) => {
//                 request(app)
//                     .get("/users/me")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.userType).toBe(users[1].userType);
//                         expect(res.body.userDetail.name).toBe(userDetails[1].name);
//                         expect(res.body.userDetail.address).toBe(userDetails[1].address);
//                     })
//                     .end(done);
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should get userDetail if authenticated", (done) => {
//                 request(app)
//                     .get("/users/me")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.userType).toBe(users[2].userType);
//                         expect(res.body.userDetail.name).toBe(userDetails[2].name);
//                         expect(res.body.userDetail.address).toBe(userDetails[2].address);
//                     })
//                     .end(done);
//             });
//         });

//         describe("COMMON", () => {
//             it("should not get userDetail if not authenticated", (done) => {
//                 request(app)
//                     .get("/users/me")
//                     .expect(401)
//                     .end(done);
//             });
//         });
//     });

//     describe("TEST II", () => {
//         beforeEach(deleteUserDetails);

//         describe("SELLER", () => {
//             it("should not get userDetail if userDetail not in database", (done) => {
//                 request(app)
//                     .get("/users/me")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("BUYER", () => {
//             it("should not get userDetail if userDetail not in database", (done) => {
//                 request(app)
//                     .get("/users/me")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should not get userDetail if userDetail not in database", (done) => {
//                 request(app)
//                     .get("/users/me")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });
//     });
// });

// describe("DELETE /users/me", () => {
//     describe("TEST I", () => {
//         describe("SELLER", () => {
//             it("should delete userDetail if authenticated", (done) => {
//                 request(app)
//                     .delete("/users/me")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .expect(200)
//                     .end(done);
//             });
//         });

//         describe("BUYER", () => {
//             it("should delete userDetail if authenticated", (done) => {
//                 request(app)
//                     .delete("/users/me")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .expect(200)
//                     .end(done);
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should delete userDetail if authenticated", (done) => {
//                 request(app)
//                     .delete("/users/me")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .expect(200)
//                     .end(done);
//             });
//         });

//         describe("COMMON", () => {
//             it("should not delete userDetail if not authenticated", (done) => {
//                 request(app)
//                     .delete("/users/me")
//                     .expect(401)
//                     .end(done);
//             });
//         });
//     });

//     describe("TEST II", () => {
//         beforeEach(deleteUserDetails);

//         describe("SELLER", () => {
//             it("should not delete userDetail if userDetail not in database", (done) => {
//                 request(app)
//                     .delete("/users/me")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("BUYER", () => {
//             it("should not delete userDetail if userDetail not in database", (done) => {
//                 request(app)
//                     .delete("/users/me")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should not delete userDetail if userDetail not in database", (done) => {
//                 request(app)
//                     .delete("/users/me")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });
//     });
// });

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
                        UserDetail.findOne({ _creator: user._id }).then((details) => {
                            expect(details[key]).toBe(value);
                            done();
                        }).catch(e => done(e));
                    } else {
                        UserDetail.findOne({ _creator: user._id }).then((details) => {
                            expect(details.seller[key]).toBe(value);
                            done();
                        }).catch(e => done(e));
                    }
                });
        });
    };

    describe("TEST I", () => {
        describe("SELLER", () => {
            patchUser(users[0], "name", "new name");

            patchUser(users[0], "address", "new address");

            patchUser(users[0], "age", 26);

            patchUser(users[0], "weight", 55);

            patchUser(users[0], "sex", "male");

            patchUser(users[0], "occupation", "new job");

            it("should not patch userDetail if request invalid (invalid key)", (done) => {
                const body = {
                    key: "none",
                    value: "update"
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[0].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });

            it("should not patch userDetail if request invalid (invalid age)", (done) => {
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

            it("should not patch userDetail if request invalid (invalid weight)", (done) => {
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

            it("should not patch userDetail if request invalid (invalid sex)", (done) => {
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

            it("should not patch userDetail if request invalid (invalid key)", (done) => {
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
        });

        describe("VERIFIER", () => {
            patchUser(users[2], "name", "new name");

            patchUser(users[2], "address", "new address");

            it("should not patch userDetail if request invalid (invalid key)", (done) => {
                const body = {
                    key: "none",
                    value: "update"
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[2].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        });

        describe("COMMON", () => {
            it("should not patch userDetail if not authenticated", (done) => {
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

            it("should not patch userDetail if request invalid (no key)", (done) => {
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

            it("should not patch userDetail if request invalid (no value)", (done) => {
                const body = {
                    key: "new field",
                    two: "update"
                };

                request(app)
                    .patch("/users/me")
                    .set("x-auth", users[1].tokens[0].token)
                    .send(body)
                    .expect(400)
                    .end(done);
            });
        });
    });

    describe("TEST II", () => {
        beforeEach(deleteUserDetails);

        describe("SELLER", () => {
            it("should not patch userDetail if userDetail not in database", (done) => {
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
            it("should not patch userDetail if userDetail not in database", (done) => {
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
            it("should not patch userDetail if userDetail not in database", (done) => {
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
