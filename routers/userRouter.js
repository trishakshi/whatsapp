require("dotenv").config();
const User = require("../models/userModel");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");

router.post("/register", async (req, res) => {
  try {
    const { username, password, passwordVerify } = req.body;

    if (!username || !password || !passwordVerify)
      return res.status(400).json({ err: "All fields are required!" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ err: "Password should be at least six characters long." });

    if (password !== passwordVerify)
      return res.status(400).json({ err: "Both passwords must be similar." });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ err: "Account already exists!" });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      passwordHash,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, { httpOnly: true }).send();
  } catch (err) {
    return res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //validation

    if (!username || !password)
      return res.status(400).json({ err: "All fields are required!" });

    const existingUser = await User.findOne({ username });
    if (!existingUser)
      return res.status(400).json({ err: "Incorrect username or password!" });

    const correctPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!correctPassword)
      return res.status(400).json({ err: "Incorrect username or password!" });

    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, { httpOnly: true }).send();
  } catch (err) {
    return res.status(500).send();
  }
});

router.get("/loggedUser", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.json(null);

    const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
    res.json(validatedUser.id);
  } catch (err) {
    return res.json(null);
  }
});

router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token").send();
  } catch (err) {
    return res.json(null);
  }
});

module.exports = router;

// try {
// } catch (err) {
//   return res.status(500).send();
// }
