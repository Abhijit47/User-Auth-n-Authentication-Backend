const dotenv = require('dotenv');
dotenv.config({ path: './config.env', encoding: 'utf8', debug: false, override: false });
const nodemailer = require('nodemailer');
const { successResponse, checkConsole, errorResponse, errorMessage } = require('../utilities/utils');

exports.sendMailToUser = async (res, name, email, token) => {

  try {
    const transporter = nodemailer.createTransport({
      // host: "smtp.forwardemail.net",
      // port: 465,
      // secure: true,
      service: "gmail",
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.email,
        pass: process.env.email_access
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.email,
      // to: process.env.dev_email, // developement time
      to: email, // production time
      subject: "Reset your Password",
      html: `
          <p>
          Hiii ${name},Please copy the link  
            <a href="http://localhost:3000/resetpassword/${token}"target=_blank>click here</a>  
              and reset your password
          </p>
      `
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        errorMessage(res, err);
      }
      successResponse(res, response.accepted, 250, response.accepted);
      // console.log("Message sent"); developement time
      transporter.close();
    });

  } catch (err) {
    errorResponse(res, err.message, 400);
  }

};
