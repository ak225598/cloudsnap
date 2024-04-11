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
      subject:emailType === "VERIFY"? "Verify Your Email Address" : "Reset Your Password",
      html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #e6ccff;">
              <div style="text-align: center;">
                <img src=${process.env.MAILER_LOGO_URL} alt="Logo" style="width: 120px; height: 100px; background-color: #7a00cc; border-radius: 10%; display: inline-block; color: #fff; margin-top: 20px; margin-bottom: 20px;" />
                <div style="width: 40%; margin: 0 auto 20px; background-color: #fff; padding: 30px; text-align: center; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                  <div style="font-size: 18px; margin-bottom: 20px;">Hey ${username},</div>
                  <div style="margin-bottom: 20px; line-height: 1.5;">Please click the button below to ${emailType === "VERIFY"? "verify your email address": "reset your password"}:</div>
                  <a href="${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "changePassword"}?token=${hashedToken}" style="text-decoration: none; display: inline-block;">
                    <button style="padding: 10px 20px; background-color: #993399; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; transition: background-color 0.3s;">${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
                    </button>
                  </a>
                  <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">
                  <p style="margin-bottom: 20px;">Alternatively, Copy and paste the following link into your browser:</p>
                  <p style="margin-bottom: 20px;">${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "changePassword"}?token=${hashedToken}</p>
                  <p>If you encounter any issues or have questions, please don't hesitate to contact us. We're here to assist you.</p>
                </div>
              </div>
            </body>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
      return mailresponse;
  } catch (error) {
      throw new Error(error.message);
    }
};
