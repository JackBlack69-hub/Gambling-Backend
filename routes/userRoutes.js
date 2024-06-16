const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokens");
const UserController = require("../app/controllers/userController");
const { upload } = require("../middleware/validateUploads");

const userController = new UserController();

router.post("/signUp", userController.signUp.bind(userController));
router.post("/login", userController.login.bind(userController));
router.get("/verifyEmail", userController.verifyEmail.bind(userController));
router.get(
  "/getUser",
  validateToken,
  userController.getUser.bind(userController)
);
router.get(
  "/getAllUsers",
  validateToken,
  userController.gelAllUsers.bind(userController)
);
router.post(
  "/uploadPfp",
  validateToken,
  upload.single("image"),
  userController.uploadPfp.bind(userController)
);

router.get(
  "/getPfp",

  validateToken,
  userController.getPfp.bind(userController)
);
module.exports = router;
