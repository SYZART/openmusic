const nodemailer = require('nodemailer');
 
class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  sendEmail(targetEmail, content) {
    const date = +new Date();
    const message = {
      from: 'Songs Apps',
      to: targetEmail,
      subject: 'Ekspor Playlist',
      text: 'Terlampir hasil dari ekspor Playlist',
      attachments: [
        {
          filename: `${date}-playlists.json`,
          content,
        },
      ],
    };
 
    return this._transporter.sendMail(message);
  }
}
module.exports= MailSender;