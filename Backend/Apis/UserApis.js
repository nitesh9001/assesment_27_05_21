const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Model/UserModel");
const auth = require("../auth");

//LOGIN FOR USER
router.post(
  "/login",
  [
    check("email", "Please enter valid email").isEmail(),
    check("password", "Please enter a password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (!user)
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid Credentials" }] });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid Credentials" }] });

      const payload = {
        user: {
          email: user.email,
          id: user._id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (token)
            res.json({
              status: true,
              data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNo: user.phoneNo,
                address: user.address,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                token: token,
              },
            });
          else res.json({ status: false, message: "token not generated " });
        }
      );
    } catch (err) {
      res.json({ status: false, message: "Login failed" });
    }
  }
);

//REGISTER NEW USER
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phoneNo, address } = req.body;
    if (!name || !phoneNo || !password || !address || !email)
      return res.status(400).json({
        status: false,
        errors: {
          message:
            "name ,address, phoneNo ,email, password should not be empty",
        },
      });

    try {
      let user = await User.findOne({ email: email });
      if (user)
        return res
          .status(400)
          .json({ errors: { message: "User already exists" } });

      const salt = await bcrypt.genSalt(10);
      const passwordHased = await bcrypt.hash(password, salt);

      const newUser = new User({
        email: email,
        phoneNo: phoneNo,
        name: name,
        password: passwordHased,
        address: address,
      });

      await newUser.save();
      res.json({ status: true, message: "User  added" });
    } catch (err) {
      res.json({ status: false, message: "User not added", errors: err });
    }
  }
);

//DELETE USER
router.delete("/delete", auth, async (req, res) => {
  try {
    const removePost = await User.remove({
      _id: req.user.user.id,
    });
    res.json(removePost);
  } catch (err) {
    res.json({ message: err });
  }
});

//CHNAGE USER DATA
router.patch("/update", auth, async (req, res) => {
  try {
    const userData = req.body;
    if (req.body.password)
      return res.json({
        status: false,
        message: "Password can not chnage",
      });
    const changeuser = await User.findOneAndUpdate(
      {
        _id: req.user.user.id,
      },
      {
        $set: userData,
      },
      { upsert: true, returnNewDocument: true }
    );
    res.json({
      status: true,
    });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
