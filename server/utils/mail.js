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
        html: `<strong><a href="${process.env.HOME}/confirm?secret=${secret}">CLICK TO CONFIRM</a></strong>`
    };

    if (process.env.NODE_ENV === "development") {
        // Send Email
        const info = await transporter.sendMail(message);

        // Message Confirmation Log
        console.log("Message sent: %s", JSON.stringify(info));

        // Return email info
        return info;
    } else {
        // Send Email
        const info = await transporter.sendMail(message);

        // Return email info
        return info;
    }
};

const sendResetMail = async (email, secret) => {
    // Set Email
    const message = {
        to: email,
        from: "no-reply@myentity.co",
        subject: "PASSWORD RESET",
        html: `<form action="${process.env.HOME}/forgot?secret=${secret}" method="post">NEW PASSWORD<br/><input name="password" type="password"/><br/>CONFIRM PASSWORD<br/><input name="confirm" type="password"/><br/><button type="submit">RESET</button></form>`
    };

    if (process.env.NODE_ENV === "development") {
        // Send Email
        const info = await transporter.sendMail(message);

        // Message Confirmation Log
        console.log("Message sent: %s", JSON.stringify(info));

        // Return email info
        return info;
    } else {
        // Send Email
        const info = await transporter.sendMail(message);

        // Return email info
        return info;
    }
};

module.exports = { sendConfirmationMail, sendResetMail };
