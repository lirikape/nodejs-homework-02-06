const nodemailer = require("nodemailer");
const envsConfigs = require("../configs/envsConfigs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envsConfigs.email,
    pass: envsConfigs.gmailPass,
  },
});
// const email = {
//   subject: "Test",
//   from: envsConfigs.email,
//   to: "lirikape@gmail.com",
//   html: "<h2>test</h2>",
// };
const sendEmail = async (data) => {
  const email = { ...data, from: envsConfigs.email };
  await transporter.sendMail(email);
  return true;
};

module.exports = sendEmail;

// transporter.sendMail(email);

// const brevo = require("@getbrevo/brevo");
// const envsConfigs = require("../configs/envsConfigs");

// const apiInstance = new brevo.TransactionalEmailsApi();
// // const { EMAIL, BREVO_API_KEY } = process.env;

// apiInstance.authentications.apiKey.apiKey = envsConfigs.brevoApi;

// const email = {
//   subject: "Test",
//   sender: { email: envsConfigs.email },
//   to: [{ email: "lirikape@gmail.com" }],
//   htmlContent: "<html><body><h2>test</h2></body></html>",
// };

// apiInstance.sendTransacEmail(email).then(() => {
//   console.log("Sended");
// });
