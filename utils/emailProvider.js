// eslint-disable-next-line import/no-extraneous-dependencies
const SibApiV3Sdk = require('@getbrevo/brevo');

const htmlTemplate = (name, code) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Password Reset</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
          
          <!-- Header Image -->
          <tr>
            <td align="center" style="padding:30px 20px 10px 20px;">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyvu8RS6EQTzFLVYE-Bjbhy00hmlw4Zje07Q&s" 
                   alt="Reset Password" 
                   width="120" 
                   style="display:block;border-radius:8px;">
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding:10px 30px;">
              <h2 style="margin:0;color:#1a1a1a;">Reset Your Password</h2>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td align="center" style="padding:20px 40px;color:#555;font-size:15px;line-height:1.6;">
              Hi <strong>${name}</strong>,<br><br>
              We received a request to reset your E-Shop account password.
              Use the verification code below to continue.
            </td>
          </tr>

          <!-- Code Box -->
          <tr>
            <td align="center" style="padding:10px 40px;">
              <div style="
                background:#f0f4ff;
                color:#2b4eff;
                font-size:28px;
                letter-spacing:6px;
                font-weight:bold;
                padding:18px 0;
                border-radius:8px;">
                ${code}
              </div>
            </td>
          </tr>

          <!-- Expiry Text -->
          <tr>
            <td align="center" style="padding:20px 40px;color:#777;font-size:14px;">
              This code is valid for <strong>10 minutes</strong> only.
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:30px 20px;background:#fafafa;color:#999;font-size:12px;">
              If you didn’t request this, you can safely ignore this email.<br>
              © ${new Date().getFullYear()} E-Shop. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const EmailSender = async (options) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = htmlTemplate(options.name, options.code);
    sendSmtpEmail.sender = { "name": "E-Shop", "email": process.env.EMAIL_USER }; 
    sendSmtpEmail.to = [{ "email": options.email, "name": options.name }];
    return await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = EmailSender;
