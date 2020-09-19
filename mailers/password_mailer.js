const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newPassword = (user) => {
    let htmlString = nodeMailer.renderTemplate({ user: user }, '/password/new_password.ejs');

    nodeMailer.transporter.sendMail({
        from: 'shivamsinghgbpit@gmail.com',
        to: user.email,
        subject: "Reset Password",
        html: htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }

        // console.log('Message sent', info);
        return;
    });
}