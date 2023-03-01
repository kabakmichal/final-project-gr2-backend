const sgMail = require("@sendgrid/mail");

async function sendVerificationMail(
  email,
  username,
  verificationToken,
  templateId,
  fromEmail
) {
  const msg = {
    to: email,
    from: { name: "Questify Team", email: fromEmail },
    templateId: templateId,
    username,
    dynamic_template_data: {
      username,
      verificationUrl: `http://localhost:3000/api/users/verify/${verificationToken}`,
    },
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    return {
      message:
        "oops something went wrong, we cannot send your verification email",
    };
  }
}

module.exports = sendVerificationMail;
