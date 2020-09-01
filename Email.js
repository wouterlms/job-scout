const nodemailer = require('nodemailer');

module.exports = class Email {

	#transporter;

	constructor(service, auth) {
		this.#transporter = nodemailer.createTransport({ service, auth });
	}

	send(to, subject, html) {

		const mail = {
			from: this.#transporter.options.auth.user,
			to,
			subject,
			html
		};

		this.#transporter.sendMail(mail, (err, info) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`Email sent to ${to}`);
			}
		});
	}
}