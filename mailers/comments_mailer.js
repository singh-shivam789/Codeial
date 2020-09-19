const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs');
    const string = "New Comment Published!";
    nodeMailer.transporter.sendMail({
        from: 'shivamsinghgbpit@gmail.com',
        to: comment.user.email,
        subject: string,
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