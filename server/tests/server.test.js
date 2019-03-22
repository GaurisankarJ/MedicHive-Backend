// // Mocha Test Framework

// // Lodash
// // const _ = require("lodash");
// // Testing with Jest, expect function
// const expect = require("expect");
// // Testing HTTP via superagent
// const request = require("supertest");

// // The app for testing
// const { app } = require("./../server.js");
// // The User model
// const { User } = require("./../models/user.js");
// // The UserDetail model
// const { UserDetail } = require("../models/userDetail.js");
// // The Record model
// const { Record } = require("./../models/record.js");
// // Seed Data
// const { users, populateUsers, userDetails, populateUserDetails, deleteUserDetails, records, populateRecords, deleteRecords } = require("./seed/seed");

// // Testing life-cycle, beforeEach Hook
// // Populating Users
// beforeEach(populateUsers);
// // Populating User Details
// beforeEach(populateUserDetails);
// // Populating Records
// beforeEach(populateRecords);

// describe("POST /users", () => {
//     it("should create a user and return _id, email, userType", (done) => {
//         const body = {
//             email: "example@example.com",
//             password: "password123",
//             userType: "b"
//         };

//         request(app)
//             .post("/users")
//             .send(body)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.header["x-auth"]).toBeTruthy();
//                 expect(res.body.email).toBe(body.email);
//                 expect(res.body.userType).toBe(body.userType);
//             })
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 User.findOne({ email: body.email }).then((user) => {
//                     expect(user).toBeTruthy();
//                     expect(user.confirmation).toBeTruthy();
//                     expect(user.tokens).toBeTruthy();
//                     expect(user.password).not.toBe(body.password);
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should not create a user if request invalid (no email)", (done) => {
//         const body = {
//             one: "example",
//             password: "password",
//             userType: "b"
//         };

//         request(app)
//             .post("/users")
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not create a user if request invalid (no password)", (done) => {
//         const body = {
//             one: "example@example.com",
//             two: "password",
//             userType: "b"
//         };

//         request(app)
//             .post("/users")
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not create a user if request invalid (no userType)", (done) => {
//         const body = {
//             email: "example@example.com",
//             password: "password",
//             three: "s"
//         };

//         request(app)
//             .post("/users")
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not create a user if request invalid (invalid email)", (done) => {
//         const body = {
//             email: "example",
//             password: "password",
//             userType: "b"
//         };

//         request(app)
//             .post("/users")
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not create a user if request invalid (invalid password)", (done) => {
//         const body = {
//             email: "example@example.com",
//             password: "pass",
//             userType: "b"
//         };

//         request(app)
//             .post("/users")
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not create a user if request invalid (invalid userType)", (done) => {
//         const body = {
//             email: "example@example.com",
//             password: "password",
//             userType: "x"
//         };

//         request(app)
//             .post("/users")
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not create a user if user already exists", (done) => {
//         const body = {
//             email: "seller@example.com",
//             password: "userOnePass",
//             userType: "s"
//         };

//         request(app)
//             .post("/users")
//             .send(body)
//             .expect(400)
//             .end(done);
//     });
// });

// describe("GET /users/confirm", () => {
//     it("should activate a user if secret valid", (done) => {
//         const { secret } = users[0].confirmation[0];

//         request(app)
//             .get(`/users/confirm?secret=${secret}`)
//             .expect(302)
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 User.findOne({ _id: users[0]._id }).then((user) => {
//                     expect(user.isActive).toBeTruthy();
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should not activate user if request invalid (invalid secret)", (done) => {
//         const secret = "some secret";

//         request(app)
//             .get(`/users/confirm?secret=${secret}`)
//             .expect(404)
//             .end(done);
//     });

//     it("should not activate user if request invalid (no secret)", (done) => {
//         request(app)
//             .get("/users/confirm?email=something-invalid")
//             .expect(400)
//             .end(done);
//     });
// });

// describe("GET /users/forgot", () => {
//     it("should send confirmation mail for user in database", (done) => {
//         const { email } = users[0];

//         request(app)
//             .get(`/users/forgot?email=${email}`)
//             .expect(200)
//             .end(done);
//     });

//     it("should not send confirmation mail if request invalid (no email)", (done) => {
//         request(app)
//             .get("/users/forgot?username=email")
//             .expect(400)
//             .end(done);
//     });

//     it("should not send confirmation mail if request invalid (invalid email)", (done) => {
//         const { email } = "example@xyz.com";

//         request(app)
//             .get(`/users/forgot?email=${email}`)
//             .expect(404)
//             .end(done);
//     });
// });

// describe("POST /users/forgot", () => {
//     it("should reset password if user in database", (done) => {
//         const { secret } = users[0].confirmation[0];
//         const body = {
//             password: "password",
//             confirm: "password"
//         };

//         request(app)
//             .post(`/users/forgot?secret=${secret}`)
//             .send(body)
//             .expect(302)
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 User.findByCredentials(users[0].email, body.password).then((user) => {
//                     expect(user).toBeTruthy();
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should not reset password if request invalid (request body)", (done) => {
//         const { secret } = users[0].confirmation[0];
//         const body = {
//             pass: "password",
//             conf: "notpassword"
//         };

//         request(app)
//             .post(`/users/forgot?secret=${secret}`)
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not reset password if request invalid (password and confirm do not match)", (done) => {
//         const { secret } = users[0].confirmation[0];
//         const body = {
//             password: "password",
//             confirm: "notpassword"
//         };

//         request(app)
//             .post(`/users/forgot?secret=${secret}`)
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not reset password if request invalid (secret)", (done) => {
//         const { secret } = "secret";
//         const body = {
//             password: "password",
//             confirm: "password"
//         };

//         request(app)
//             .post(`/users/forgot?secret=${secret}`)
//             .send(body)
//             .expect(404)
//             .end(done);
//     });
// });

// describe("DELETE /users", () => {
//     it("should delete user if authenticated", (done) => {
//         request(app)
//             .delete("/users")
//             .set("x-auth", users[0].tokens[0].token)
//             .expect(200)
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 User.findOne({ email: users[0].email }).then((user) => {
//                     expect(user).toBeFalsy();
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should not delete user if not authenticated", (done) => {
//         request(app)
//             .delete("/users")
//             .expect(401)
//             .end(done);
//     });
// });

// describe("PATCH /users", () => {
//     it("should patch email of user if authenticated", (done) => {
//         const body = {
//             key: "email",
//             value: "sellerNew@example.com"
//         };

//         request(app)
//             .patch("/users")
//             .set("x-auth", users[0].tokens[0].token)
//             .send(body)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.message).toBe("email reset");
//                 expect(res.body.email).toBe(body.value);
//             })
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 User.findOne({ email: body.value }).then((user) => {
//                     expect(user).toBeTruthy();
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should patch password of user if authenticated", (done) => {
//         const body = {
//             key: "password",
//             value: "newPassword"
//         };

//         request(app)
//             .patch("/users")
//             .set("x-auth", users[0].tokens[0].token)
//             .send(body)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.message).toBe("password reset");
//                 expect(res.body.email).toBe(users[0].email);
//             })
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 User.findByCredentials(users[0].email, body.value).then((user) => {
//                     expect(user).toBeTruthy();
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should not patch user if request invalid (no key)", (done) => {
//         const body = {
//             one: "email",
//             value: "seller@example.com"
//         };

//         request(app)
//             .patch("/users")
//             .set("x-auth", users[0].tokens[0].token)
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not patch user if request invalid (no value)", (done) => {
//         const body = {
//             key: "email",
//             two: "seller@example.com"
//         };

//         request(app)
//             .patch("/users")
//             .set("x-auth", users[0].tokens[0].token)
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not patch email of user if email same as saved", (done) => {
//         const body = {
//             key: "email",
//             value: "seller@example.com"
//         };

//         request(app)
//             .patch("/users")
//             .set("x-auth", users[0].tokens[0].token)
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not patch email of user if request invalid (email)", (done) => {
//         const body = {
//             key: "email",
//             value: "seller"
//         };

//         request(app)
//             .patch("/users")
//             .set("x-auth", users[0].tokens[0].token)
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not patch password of user if password same as saved", (done) => {
//         const body = {
//             key: "password",
//             value: "userOnePass"
//         };

//         request(app)
//             .patch("/users")
//             .set("x-auth", users[0].tokens[0].token)
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not patch password of user if request invalid (password)", (done) => {
//         const body = {
//             key: "password",
//             value: "user"
//         };

//         request(app)
//             .patch("/users")
//             .set("x-auth", users[0].tokens[0].token)
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not patch user if not authenticated", (done) => {
//         const body = {
//             key: "email",
//             value: "sellerNew@example.com"
//         };

//         request(app)
//             .patch("/users")
//             .send(body)
//             .expect(401)
//             .end(done);
//     });
// });

// describe("POST /users/login", () => {
//     it("should resolve user with valid email and password, return x-auth", (done) => {
//         const body = {
//             email: users[1].email,
//             password: users[1].password
//         };

//         request(app)
//             .post("/users/login")
//             .send(body)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.header["x-auth"]).toBeTruthy();
//                 expect(res.body.email).toBe(users[1].email);
//                 expect(res.body.userType).toBe(users[1].userType);
//             })
//             .end((err, res) => {
//                 if (err) {
//                     done(err);
//                 }

//                 User.findOne({ email: res.body.email }).then((user) => {
//                     if (!user) {
//                         done();
//                     }

//                     expect(user.toObject().tokens[1]).toMatchObject({
//                         access: "b-auth",
//                         token: res.header["x-auth"]
//                     });
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should reject user if invalid request (no email)", (done) => {
//         const body = {
//             one: "one",
//             password: "password"
//         };

//         request(app)
//             .post("/users/login")
//             .send(body)
//             .expect(400)
//             .expect((res) => {
//                 expect(res.header["x-auth"]).toBeFalsy();
//             })
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 User.findById(users[1]._id).then((user) => {
//                     if (!user) {
//                         done();
//                     }
//                     expect(user.tokens.length).toBe(1);
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should reject user if invalid request (no password)", (done) => {
//         const body = {
//             email: users[1].email,
//             two: "two"
//         };

//         request(app)
//             .post("/users/login")
//             .send(body)
//             .expect(400)
//             .expect((res) => {
//                 expect(res.header["x-auth"]).toBeFalsy();
//             })
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 User.findById(users[1]._id).then((user) => {
//                     if (!user) {
//                         done();
//                     }
//                     expect(user.tokens.length).toBe(1);
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should reject user if wrong password", (done) => {
//         const body = {
//             email: users[1].email,
//             password: "wrongPassword"
//         };

//         request(app)
//             .post("/users/login")
//             .send(body)
//             .expect(404)
//             .expect((res) => {
//                 expect(res.header["x-auth"]).toBeFalsy();
//             })
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 User.findById(users[1]._id).then((user) => {
//                     if (!user) {
//                         done();
//                     }
//                     expect(user.tokens.length).toBe(1);
//                     done();
//                 }).catch(e => done(e));
//             });
//     });
// });

// describe("DELETE /users/logout", () => {
//     it("should remove authentication token on logout", (done) => {
//         request(app)
//             .delete("/users/logout")
//             .set("x-auth", users[0].tokens[0].token)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.logout).toBe("successful");
//             })
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 User.findById(users[0]._id).then((user) => {
//                     if (!user) {
//                         done();
//                     }
//                     expect(user.tokens.length).toBe(0);
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should not remove authentication token if not authenticated", (done) => {
//         request(app)
//             .delete("/users/logout")
//             .expect(401)
//             .end(done);
//     });
// });

// describe("POST /users/me", () => {
//     beforeEach(deleteUserDetails);
//     it("should create userDetails for seller if authenticated", (done) => {
//         const body = {
//             name: "example",
//             address: "example address",
//             seller: {
//                 age: 24,
//                 weight: 130,
//                 sex: "female",
//                 occupation: "job"
//             }
//         };

//         request(app)
//             .post("/users/me")
//             .set("x-auth", users[0].tokens[0].token)
//             .send(body)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.email).toBe(users[0].email);
//                 expect(res.body.message).toBe("user created");
//             })
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }
//                 UserDetail.findOne({ _creator: users[0]._id }).then((details) => {
//                     expect(details.name).toBe(body.name);
//                     expect(details.address).toBe(body.address);
//                     expect(details.seller.age).toBe(body.seller.age);
//                     expect(details.seller.weight).toBe(body.seller.weight);
//                     expect(details.seller.sex).toBe(body.seller.sex);
//                     expect(details.seller.occupation).toBe(body.seller.occupation);
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should create userDetails for buyer if authenticated", (done) => {
//         const body = {
//             name: "example",
//             address: "example address"
//         };

//         request(app)
//             .post("/users/me")
//             .set("x-auth", users[1].tokens[0].token)
//             .send(body)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.email).toBe(users[1].email);
//                 expect(res.body.message).toBe("user created");
//             })
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 UserDetail.findOne({ _creator: users[1]._id }).then((details) => {
//                     expect(details.name).toBe(body.name);
//                     expect(details.address).toBe(body.address);
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should create userDetails for verifier if authenticated", (done) => {
//         const body = {
//             name: "example",
//             address: "example address"
//         };

//         request(app)
//             .post("/users/me")
//             .set("x-auth", users[2].tokens[0].token)
//             .send(body)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.email).toBe(users[2].email);
//                 expect(res.body.message).toBe("user created");
//             })
//             .end((err) => {
//                 if (err) {
//                     done(err);
//                 }

//                 UserDetail.findOne({ _creator: users[2]._id }).then((details) => {
//                     expect(details.name).toBe(body.name);
//                     expect(details.address).toBe(body.address);
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it("should not create userDetails if request invalid (no name)", (done) => {
//         const body = {
//             one: "example",
//             address: "example address"
//         };

//         request(app)
//             .post("/users/me")
//             .set("x-auth", users[1].tokens[0].token)
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not create userDetails if request invalid (no address)", (done) => {
//         const body = {
//             name: "example",
//             two: "example address"
//         };

//         request(app)
//             .post("/users/me")
//             .set("x-auth", users[1].tokens[0].token)
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not create userDetails if request invalid (invalid seller)", (done) => {
//         const body = {
//             name: "example",
//             address: "example address",
//             seller: {
//                 name: "name",
//                 address: "address"
//             }
//         };

//         request(app)
//             .post("/users/me")
//             .set("x-auth", users[0].tokens[0].token)
//             .send(body)
//             .expect(400)
//             .end(done);
//     });

//     it("should not create userDetails if not authenticated", (done) => {
//         const body = {
//             name: "example",
//             address: "example address"
//         };

//         request(app)
//             .post("/users/me")
//             .send(body)
//             .expect(401)
//             .end(done);
//     });
// });

// describe("GET /users/me", () => {
//     describe("TEST I", () => {
//         it("should get userDetails if authenticated (seller)", (done) => {
//             request(app)
//                 .get("/users/me")
//                 .set("x-auth", users[0].tokens[0].token)
//                 .expect(200)
//                 .expect((res) => {
//                     expect(res.body.userType).toBe(users[0].userType);
//                     expect(res.body.userDetails.name).toBe(userDetails[0].name);
//                     expect(res.body.userDetails.address).toBe(userDetails[0].address);
//                     expect(res.body.userDetails.seller.age).toBe(userDetails[0].seller.age);
//                     expect(res.body.userDetails.seller.weight).toBe(userDetails[0].seller.weight);
//                     expect(res.body.userDetails.seller.sex).toBe(userDetails[0].seller.sex);
//                     expect(res.body.userDetails.seller.occupation).toBe(userDetails[0].seller.occupation);
//                 })
//                 .end(done);
//         });

//         it("should get userDetails if authenticated (buyer)", (done) => {
//             request(app)
//                 .get("/users/me")
//                 .set("x-auth", users[1].tokens[0].token)
//                 .expect(200)
//                 .expect((res) => {
//                     expect(res.body.userType).toBe(users[1].userType);
//                     expect(res.body.userDetails.name).toBe(userDetails[1].name);
//                     expect(res.body.userDetails.address).toBe(userDetails[1].address);
//                 })
//                 .end(done);
//         });

//         it("should get userDetails if authenticated (verifier)", (done) => {
//             request(app)
//                 .get("/users/me")
//                 .set("x-auth", users[2].tokens[0].token)
//                 .expect(200)
//                 .expect((res) => {
//                     expect(res.body.userType).toBe(users[2].userType);
//                     expect(res.body.userDetails.name).toBe(userDetails[2].name);
//                     expect(res.body.userDetails.address).toBe(userDetails[2].address);
//                 })
//                 .end(done);
//         });

//         it("should not get userDetails if not authenticated", (done) => {
//             request(app)
//                 .get("/users/me")
//                 .expect(401)
//                 .end(done);
//         });
//     });

//     describe("TEST II", () => {
//         beforeEach(deleteUserDetails);
//         it("should not get userDetails if userDetails not in database", (done) => {
//             request(app)
//                 .get("/users/me")
//                 .set("x-auth", users[0].tokens[0].token)
//                 .expect(404)
//                 .end(done);
//         });
//     });
// });

// describe("DELETE /users/me", () => {
//     describe("TEST I", () => {
//         it("should delete userDetails if authenticated (seller)", (done) => {
//             request(app)
//                 .delete("/users/me")
//                 .set("x-auth", users[0].tokens[0].token)
//                 .expect(200)
//                 .end(done);
//         });

//         it("should delete userDetails if authenticated (buyer)", (done) => {
//             request(app)
//                 .delete("/users/me")
//                 .set("x-auth", users[1].tokens[0].token)
//                 .expect(200)
//                 .end(done);
//         });

//         it("should delete userDetails if authenticated (verifier)", (done) => {
//             request(app)
//                 .delete("/users/me")
//                 .set("x-auth", users[2].tokens[0].token)
//                 .expect(200)
//                 .end(done);
//         });

//         it("should not delete userDetails if not authenticated", (done) => {
//             request(app)
//                 .delete("/users/me")
//                 .expect(401)
//                 .end(done);
//         });
//     });

//     describe("TEST II", () => {
//         beforeEach(deleteUserDetails);
//         it("should not delete userDetails if userDetails not in database (seller)", (done) => {
//             request(app)
//                 .delete("/users/me")
//                 .set("x-auth", users[0].tokens[0].token)
//                 .expect(404)
//                 .end(done);
//         });

//         it("should not delete userDetails if userDetails not in database (buyer)", (done) => {
//             request(app)
//                 .delete("/users/me")
//                 .set("x-auth", users[1].tokens[0].token)
//                 .expect(404)
//                 .end(done);
//         });

//         it("should not delete userDetails if userDetails not in database (verifier)", (done) => {
//             request(app)
//                 .delete("/users/me")
//                 .set("x-auth", users[2].tokens[0].token)
//                 .expect(404)
//                 .end(done);
//         });
//     });
// });

// describe("PATCH /users/me", () => {
//     const patchUser = (user, key, value) => {
//         it(`should patch ${key} if authenticated`, (done) => {
//             const body = { key, value };

//             request(app)
//                 .patch("/users/me")
//                 .set("x-auth", user.tokens[0].token)
//                 .send(body)
//                 .expect(200)
//                 .expect((res) => {
//                     expect(res.body.message).toBe(`${key} updated`);
//                     expect(res.body.email).toBe(user.email);
//                 })
//                 .end((err) => {
//                     if (err) {
//                         done(err);
//                     }

//                     if (key === "name" || key === "address") {
//                         UserDetail.findOne({ _creator: user._id }).then((details) => {
//                             expect(details[key]).toBe(value);
//                             done();
//                         }).catch(e => done(e));
//                     } else {
//                         UserDetail.findOne({ _creator: user._id }).then((details) => {
//                             expect(details.seller[key]).toBe(value);
//                             done();
//                         }).catch(e => done(e));
//                     }
//                 });
//         });
//     };

//     describe("TEST I", () => {
//         describe("SELLER", () => {
//             patchUser(users[0], "name", "new name");

//             patchUser(users[0], "address", "new address");

//             patchUser(users[0], "age", 26);

//             patchUser(users[0], "weight", 55);

//             patchUser(users[0], "sex", "male");

//             patchUser(users[0], "occupation", "new job");
//         });

//         describe("BUYER", () => {
//             patchUser(users[1], "name", "new name");

//             patchUser(users[1], "address", "new address");
//         });

//         describe("VERIFIER", () => {
//             patchUser(users[2], "name", "new name");

//             patchUser(users[2], "address", "new address");
//         });

//         describe("COMMON", () => {
//             it("should not patch userDetails if request invalid (no key)", (done) => {
//                 const body = {
//                     one: "field",
//                     value: "new update"
//                 };

//                 request(app)
//                     .patch("/users/me")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });

//             it("should not patch userDetails if request invalid (no value)", (done) => {
//                 const body = {
//                     key: "new field",
//                     two: "update"
//                 };

//                 request(app)
//                     .patch("/users/me")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });

//             it("should not patch userDetails if request invalid (invalid key)", (done) => {
//                 const body = {
//                     key: "none",
//                     value: "update"
//                 };

//                 request(app)
//                     .patch("/users/me")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });

//             it("should not patch userDetails if not authenticated", (done) => {
//                 const body = {
//                     key: "new field",
//                     value: "new update"
//                 };

//                 request(app)
//                     .patch("/users/me")
//                     .send(body)
//                     .expect(401)
//                     .end(done);
//             });
//         });
//     });

//     describe("TEST II", () => {
//         beforeEach(deleteUserDetails);

//         describe("SELLER", () => {
//             it("should not patch userDetails if userDetails not in database", (done) => {
//                 const body = {
//                     key: "new field",
//                     value: "new update"
//                 };

//                 request(app)
//                     .patch("/users/me")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .send(body)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("BUYER", () => {
//             it("should not patch userDetails if userDetails not in database", (done) => {
//                 const body = {
//                     key: "new field",
//                     value: "new update"
//                 };

//                 request(app)
//                     .patch("/users/me")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .send(body)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should not patch userDetails if userDetails not in database", (done) => {
//                 const body = {
//                     key: "new field",
//                     value: "new update"
//                 };

//                 request(app)
//                     .patch("/users/me")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .send(body)
//                     .expect(404)
//                     .end(done);
//             });
//         });
//     });
// });

// describe("POST /record", () => {
//     describe("TEST I", () => {
//         beforeEach(deleteRecords);

//         describe("SELLER", () => {
//             it("should create record if authenticated", (done) => {
//                 request(app)
//                     .post("/record")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.message).toBe("record created");
//                         expect(res.body.email).toBe(users[0].email);
//                     })
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         Record.findOne({ _creator: users[0]._id.toHexString() }).then((record) => {
//                             expect(record.log[0].event).toBe("GENESIS");
//                             expect(record.log[0].data).toBe("GENESIS");
//                             expect(record._creator.toHexString()).toBe(users[0]._id.toString());
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         });

//         describe("BUYER", () => {
//             it("should create record if authenticated", (done) => {
//                 request(app)
//                     .post("/record")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.message).toBe("record created");
//                         expect(res.body.email).toBe(users[1].email);
//                     })
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         Record.findOne({ _creator: users[1]._id.toHexString() }).then((record) => {
//                             expect(record.log[0].event).toBe("GENESIS");
//                             expect(record.log[0].data).toBe("GENESIS");
//                             expect(record._creator.toHexString()).toBe(users[1]._id.toString());
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should create record if authenticated", (done) => {
//                 request(app)
//                     .post("/record")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.message).toBe("record created");
//                         expect(res.body.email).toBe(users[2].email);
//                     })
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         Record.findOne({ _creator: users[2]._id.toHexString() }).then((record) => {
//                             expect(record.log[0].event).toBe("GENESIS");
//                             expect(record.log[0].data).toBe("GENESIS");
//                             expect(record._creator.toHexString()).toBe(users[2]._id.toString());
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         });

//         describe("COMMON", () => {
//             it("should not create record if not authenticated", (done) => {
//                 request(app)
//                     .post("/record")
//                     .expect(401)
//                     .end(done);
//             });
//         });
//     });
//     describe("TEST II", () => {
//         describe("SELLER", () => {
//             it("should not create record if record already exists", (done) => {
//                 request(app)
//                     .post("/record")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .expect(400)
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         Record.findOne({ _creator: users[0]._id.toHexString() }).then((record) => {
//                             expect(record.log.length).toBe(1);
//                             expect(record.log[0].event).toBe("GENESIS");
//                             expect(record.log[0].data).toBe("GENESIS");
//                             expect(record._creator.toHexString()).toBe(users[0]._id.toString());
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         });

//         describe("BUYER", () => {
//             it("should not create record if record already exists", (done) => {
//                 request(app)
//                     .post("/record")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .expect(400)
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         Record.findOne({ _creator: users[1]._id.toHexString() }).then((record) => {
//                             expect(record.log.length).toBe(1);
//                             expect(record.log[0].event).toBe("GENESIS");
//                             expect(record.log[0].data).toBe("GENESIS");
//                             expect(record._creator.toHexString()).toBe(users[1]._id.toString());
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should not create record if record already exists", (done) => {
//                 request(app)
//                     .post("/record")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .expect(400)
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         Record.findOne({ _creator: users[2]._id.toHexString() }).then((record) => {
//                             expect(record.log.length).toBe(1);
//                             expect(record.log[0].event).toBe("GENESIS");
//                             expect(record.log[0].data).toBe("GENESIS");
//                             expect(record._creator.toHexString()).toBe(users[2]._id.toString());
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         });
//     });
// });

// describe("GET /record", () => {
//     describe("TEST I", () => {
//         describe("SELLER", () => {
//             it("should get records if authenticated", (done) => {
//                 request(app)
//                     .get("/record")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.email).toBe(users[0].email);
//                         expect(res.body.record.allergy[0].data).toBe(records[0].allergy[0].data);
//                         expect(res.body.record.medication[0].data).toBe(records[0].medication[0].data);
//                         expect(res.body.record.problem[0].data).toBe(records[0].problem[0].data);
//                         expect(res.body.record.immunization[0].data).toBe(records[0].immunization[0].data);
//                         expect(res.body.record.vital_sign[0].data).toBe(records[0].vital_sign[0].data);
//                         expect(res.body.record.procedure[0].data).toBe(records[0].procedure[0].data);
//                     })
//                     .end(done);
//             });
//         });

//         describe("BUYER", () => {
//             it("should get records if authenticated", (done) => {
//                 request(app)
//                     .get("/record")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.email).toBe(users[1].email);
//                     })
//                     .end(done);
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should get records if authenticated", (done) => {
//                 request(app)
//                     .get("/record")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.email).toBe(users[2].email);
//                         expect(res.body.record.allergy[0].data).toBe(records[2].allergy[0].data);
//                         expect(res.body.record.medication[0].data).toBe(records[2].medication[0].data);
//                         expect(res.body.record.problem[0].data).toBe(records[2].problem[0].data);
//                         expect(res.body.record.immunization[0].data).toBe(records[2].immunization[0].data);
//                         expect(res.body.record.vital_sign[0].data).toBe(records[2].vital_sign[0].data);
//                         expect(res.body.record.procedure[0].data).toBe(records[2].procedure[0].data);
//                     })
//                     .end(done);
//             });
//         });

//         describe("COMMON", () => {
//             it("should not get record if not authenticated", (done) => {
//                 request(app)
//                     .get("/record")
//                     .expect(401)
//                     .end(done);
//             });
//         });
//     });

//     describe("TEST II", () => {
//         beforeEach(deleteRecords);

//         describe("SELLER", () => {
//             it("should not get record if record not in database", (done) => {
//                 request(app)
//                     .get("/record")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("BUYER", () => {
//             it("should not get record if record not in database", (done) => {
//                 request(app)
//                     .get("/record")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should not get record if record not in database", (done) => {
//                 request(app)
//                     .get("/record")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });
//     });
// });

// describe("DELETE /record", () => {
//     describe("TEST I", () => {
//         describe("SELLER", () => {
//             it("should delete record if authenticated", (done) => {
//                 request(app)
//                     .delete("/record")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .expect(200)
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         Record.findOne({ _creator: users[0]._id }).then((record) => {
//                             expect(record).toBeFalsy();
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         });

//         describe("BUYER", () => {
//             it("should delete record if authenticated", (done) => {
//                 request(app)
//                     .delete("/record")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .expect(200)
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         Record.findOne({ _creator: users[1]._id }).then((record) => {
//                             expect(record).toBeFalsy();
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should delete record if authenticated", (done) => {
//                 request(app)
//                     .delete("/record")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .expect(200)
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         Record.findOne({ _creator: users[2]._id }).then((record) => {
//                             expect(record).toBeFalsy();
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         });

//         describe("COMMON", () => {
//             it("should not delete record if not authenticated", (done) => {
//                 request(app)
//                     .delete("/record")
//                     .expect(401)
//                     .end(done);
//             });
//         });
//     });

//     describe("TEST II", () => {
//         beforeEach(deleteRecords);

//         describe("SELLER", () => {
//             it("should not delete record if record not in database", (done) => {
//                 request(app)
//                     .delete("/record")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("BUYER", () => {
//             it("should not delete record if record not in database", (done) => {
//                 request(app)
//                     .delete("/record")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should not delete record if record not in database", (done) => {
//                 request(app)
//                     .delete("/record")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .expect(404)
//                     .end(done);
//             });
//         });
//     });
// });

// describe("PATCH /record", () => {
//     describe("TEST I", () => {
//         const patchRecord = (user, key, n, m) => {
//             it(`should patch ${key} if authenticated`, (done) => {
//                 const body = {
//                     key,
//                     value: "New value"
//                 };

//                 request(app)
//                     .patch("/record")
//                     .set("x-auth", user.tokens[0].token)
//                     .send(body)
//                     .expect(200)
//                     .expect((res) => {
//                         expect(res.body.message).toBe(`${body.key} updated`);
//                         expect(res.body.email).toBe(user.email);
//                     })
//                     .end((err) => {
//                         if (err) {
//                             done(err);
//                         }

//                         Record.findOne({ _creator: user._id }).then((record) => {
//                             expect(record[key].length).toBe(n);
//                             expect(record.log.length).toBe(2);
//                             expect(record[key][m].data).toBe(body.value);
//                             done();
//                         }).catch(e => done(e));
//                     });
//             });
//         };
//         describe("SELLER", () => {
//             patchRecord(users[0], "allergy", 2, 1);

//             patchRecord(users[0], "medication", 2, 1);

//             patchRecord(users[0], "problem", 2, 1);

//             patchRecord(users[0], "immunization", 2, 1);

//             patchRecord(users[0], "vital_sign", 2, 1);

//             patchRecord(users[0], "procedure", 2, 1);
//         });

//         describe("BUYER", () => {
//             patchRecord(users[1], "allergy", 1, 0);

//             patchRecord(users[1], "medication", 1, 0);

//             patchRecord(users[1], "problem", 1, 0);

//             patchRecord(users[1], "immunization", 1, 0);

//             patchRecord(users[1], "vital_sign", 1, 0);

//             patchRecord(users[1], "procedure", 1, 0);
//         });

//         describe("VERIFIER", () => {
//             patchRecord(users[2], "allergy", 2, 1);

//             patchRecord(users[2], "medication", 2, 1);

//             patchRecord(users[2], "problem", 2, 1);

//             patchRecord(users[2], "immunization", 2, 1);

//             patchRecord(users[2], "vital_sign", 2, 1);

//             patchRecord(users[2], "procedure", 2, 1);
//         });

//         describe("COMMON", () => {
//             it("should not patch record if request invalid (no key)", (done) => {
//                 const body = {
//                     one: "allergy",
//                     value: "New allergy"
//                 };

//                 request(app)
//                     .patch("/record")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });

//             it("should not patch record if request invalid (no value)", (done) => {
//                 const body = {
//                     key: "allergy",
//                     two: "New allergy"
//                 };

//                 request(app)
//                     .patch("/record")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });

//             it("should not patch record if request invalid (invalid key)", (done) => {
//                 const body = {
//                     key: "none",
//                     value: "New allergy"
//                 };

//                 request(app)
//                     .patch("/record")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .send(body)
//                     .expect(400)
//                     .end(done);
//             });

//             it("should not patch record if not authenticated", (done) => {
//                 const body = {
//                     key: "allergy",
//                     value: "New allergy"
//                 };

//                 request(app)
//                     .patch("/record")
//                     .send(body)
//                     .expect(401)
//                     .end(done);
//             });
//         });
//     });

//     describe("TEST II", () => {
//         beforeEach(deleteRecords);
//         describe("SELLER", () => {
//             it("should not patch record if record not in database", (done) => {
//                 const body = {
//                     key: "allergy",
//                     value: "New allergy"
//                 };

//                 request(app)
//                     .patch("/record")
//                     .set("x-auth", users[0].tokens[0].token)
//                     .send(body)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("BUYER", () => {
//             it("should not patch record if record not in database", (done) => {
//                 const body = {
//                     key: "allergy",
//                     value: "New allergy"
//                 };

//                 request(app)
//                     .patch("/record")
//                     .set("x-auth", users[1].tokens[0].token)
//                     .send(body)
//                     .expect(404)
//                     .end(done);
//             });
//         });

//         describe("VERIFIER", () => {
//             it("should not patch record if record not in database", (done) => {
//                 const body = {
//                     key: "allergy",
//                     value: "New allergy"
//                 };

//                 request(app)
//                     .patch("/record")
//                     .set("x-auth", users[2].tokens[0].token)
//                     .send(body)
//                     .expect(404)
//                     .end(done);
//             });
//         });
//     });
// });

// describe("GET /downloads", () => {
//     it("should return an array", (done) => {
//         request(app)
//             .get("/downloads")
//             .set("x-auth", users[0].tokens[0].token)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body).toBeTruthy();
//             })
//             .end(done);
//     });

//     it("should not not return documents if not authenticated", (done) => {
//         request(app)
//             .get("/downloads")
//             .expect(401)
//             .end(done);
//     });
// });
