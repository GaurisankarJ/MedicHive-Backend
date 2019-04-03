// NodeMailer
const nodemailer = require("nodemailer");

// Setting up nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.porkbun.com",
    port: 587,
    secure: false,
    auth: {
        user: "no-reply@myentity.co",
        pass: process.env.PORKBUN_PASSWORD
    }
});

const sendConfirmationMail = async (email, secret) => {
    // Set Email
    const message = {
        to: email,
        from: "no-reply@myentity.co",
        subject: "USER CONFIRMATION",
        html: `<strong><a href="${process.env.SERVER_PAGE}/users/confirm/${secret}">CLICK TO CONFIRM</a></strong>`
    };

    if (process.env.NODE_ENV === "development") {
        try {
            // Send Email
            const info = await transporter.sendMail(message);

            // Message Confirmation Log
            console.log(`Message sent: ${JSON.stringify(info)}`);

            // Return email info
            return info;
        } catch (err) {
            throw err;
        }
    } else {
        try {
            // Send Email
            const info = await transporter.sendMail(message);

            // Return email info
            return info;
        } catch (err) {
            throw err;
        }
    }
};

const sendResetMail = async (email, secret) => {
    // Set Email
    const message = {
        to: email,
        from: "no-reply@myentity.co",
        subject: "PASSWORD RESET",
        html: `<strong><h4>KEY :</h4></strong><h3>${secret}</h3>`
    };

    if (process.env.NODE_ENV === "development") {
        try {
            // Send Email
            const info = await transporter.sendMail(message);

            // Message Confirmation Log
            console.log(`Message sent: ${JSON.stringify(info)}`);

            // Return email info
            return info;
        } catch (err) {
            throw err;
        }
    } else {
        try {
            // Send Email
            const info = await transporter.sendMail(message);

            // Return email info
            return info;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = { sendConfirmationMail, sendResetMail };
