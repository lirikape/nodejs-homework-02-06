const express = require("express");
const authController = require("../../controllers/auth");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

router.post(
  "/register",
  validateBody(schemas.registerSchema),
  authController.register
);
router.post("/login", validateBody(schemas.loginSchema), authController.login);

router.post("/current", authenticate, authController.getCurrent);

router.post("/logout", authenticate, authController.logout);
router.get("/verify/:verificationToken", authController.resend);
router.post(
  "/verify/",
  validateBody(schemas.emailSchema),
  authController.verify
);

router.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  authController.updateAvatar
);

module.exports = router;
