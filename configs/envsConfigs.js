require("dotenv").config();

const { DB_HOST, PORT, SECRET_KEY, BREVO_API_KEY, EMAIL, GMAIL_PASS, BASEURL } =
  process.env;
module.exports = {
  port: PORT,
  dbHost: DB_HOST,
  secretKey: SECRET_KEY,
  brevoApi: BREVO_API_KEY,
  email: EMAIL,
  gmailPass: GMAIL_PASS,
  baseURL: BASEURL,
};
