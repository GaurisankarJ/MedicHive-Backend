// Mocha Test Framework

// Testing with Jest, expect function
const expect = require("expect");

// Load .env
require("dotenv").config();

// The functions for testing
const { sendActivationMail, sendResetMail } = require("./../utils/mail.js");

describe("SMTP Service", () => {
    it("should send a confirmation mail and return info", (done) => {
        const email = "example@example.com";
        // const email = "sandheepsanju@gmail.com";

        sendActivationMail(email, "SECRET").then((info) => {
            expect(info.accepted[0]).toBe(email);
            expect(info.response).toContain("250");
            done();
        }).catch(err => done(err));
    });

    it("should send a reset mail and return info", (done) => {
        const email = "example@example.com";
        // const email = "louijose@gmail.com";

        sendResetMail(email, "SECRET").then((info) => {
            expect(info.accepted[0]).toBe(email);
            expect(info.response).toContain("250");
            done();
        }).catch(err => done(err));
    });
});
