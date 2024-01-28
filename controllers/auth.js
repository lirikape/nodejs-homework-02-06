const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");
const sendEmail = require("../services/emailService");
const envsConfigs = require("../configs/envsConfigs");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarUrl = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = nanoid();

  const emailSettings = {
    to: email,
    subject: "Verefication",
    html: `<a href="${envsConfigs.baseURL}/api/auth/verify/${verificationToken}" target="_blank"> click to verify</a>`,
  };

  await sendEmail(emailSettings);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarUrl,
    verificationToken,
  });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.isVerified) {
    throw HttpError(401, "Email not verify");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  console.log(token);
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      name: user.name,
    },
  });
};
const getCurrent = async (req, res) => {
  const { email, name } = req.user;

  res.json({ email, name });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Logout successful" });
};
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const oldPath = req.file.path;

  const newPath = path.resolve("public", req.file.originalname);

  await fs.rename(oldPath, newPath);
  const avatarUrl = path.join(req.file.originalname);
  const user = await User.findByIdAndUpdate(_id, { avatarUrl }, { new: true });
  res.json({ avatarUrl: user.avatarUrl });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(401, "Unauthorezed");
  }

  await User.findByIdAndUpdate(user.id, {
    verificationToken: "",
    isVerified: true,
  });
  res.json({ message: "Verifed success" });
};

const resend = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "not found");
  }
  if (user.isVerified) {
    throw HttpError(400, "User already is verified");
  }
  const emailSettings = {
    to: email,
    subject: "Verefication",
    html: `<a href="${envsConfigs.baseURL}/api/auth/verify/${user.verificationToken}" target="_blank"> click to verify</a>`,
  };
  await sendEmail(emailSettings);
  res.json({ message: "Message send" });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resend: ctrlWrapper(resend),
};
