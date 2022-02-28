const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const UserModel = require("../model/UserModel");
const auth = require("../middleware/auth");

/**Get Logged in user */
router.get("/", auth, async (req, res) => {
  try {
    const user = await await UserModel.findById(req.user.id).select(
      "-password"
    );
    res.status(200).json({ success: true, data: user });
    // console.log(user);
  } catch (errors) {
    res.status(500).json({ msg: "Internal server error", success: false });
    console.log(errors.message);
  }
});

/** User Login */
router.post(
  "/",
  [
    check("email", "Please enter valid email").isEmail(),
    check("password", "Please enter password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    // console.log(req.body);
    try {
      //Search user with the provided email address
      let user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          msg: "Login Failed ! No user with such email",
        });
      }
      //Check password using bcrypt.compare
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res
          .status(400)
          .json({ success: false, msg: "Enter valid password" });
      }

      //Create jwt token
      const payoload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payoload,
        config.get("SecretKey"),
        { expiresIn: config.get("Timeout") },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            success: true,
            data: user,
            token: token,
            msg: "Login Successful !",
          });
        }
      );
    } catch (errors) {
      res.status(500).json({ msg: "Internal server error", success: false });
      console.log(errors.message);
    }
  }
);

module.exports = router;
