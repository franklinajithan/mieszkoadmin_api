'user strict';
const config = require('../common/config.json');
const nodemailer = require('nodemailer');

var emailStatus = async function (toEmailAddress,subject,mailMessage) {
    let transport = nodemailer.createTransport({
        host: config.smtpAddress,
        port: config.smtpPort,
        auth: {
            user: config.emailAlertUsername,
            pass: config.emailAlertPassword
        }
    });

    const message = {
        from: config.fromEmailAddress, // Sender address
        to: toEmailAddress,         // List of recipients
        subject: subject,
        html: mailMessage
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            throw err;
        }
    });
};

module.exports = emailStatus;