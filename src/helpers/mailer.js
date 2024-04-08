import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId, username }) => {
  try {
    // create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 24 * 60 * 60 * 1000, // valid for 24 hrs only
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
      });
    }

    var transport = nodemailer.createTransport({
      host: `${process.env.MAILER_HOST}`,
      service: `${process.env.MAILER_SERVICE}`,
      port: `${process.env.MAILER_PORT}`,
      secure: true,
      auth: {
        user: `${process.env.MAILER_EMAIL}`,
        pass: `${process.env.MAILER_PASSWORD}`,
      },
    });

    const mailOptions = {
      from: `${process.env.MAILER_EMAIL}`,
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify Your Email Address"
          : "Reset Your Password",
      html: `<p>Hey ${username},</p>
      <p>Please click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY"
          ? "verify your email address"
          : "reset your password"
      }, or alternatively, copy and paste the following link into your browser:</p>
      <p>${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "forgetpassword"
      }?token=${hashedToken}</p>
      <p>If you encounter any issues or have questions, please don't hesitate to contact us. We're here to assist you.</p>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error) {
    throw new Error(error.message);
  }
};
