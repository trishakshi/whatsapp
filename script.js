require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const message = require("./routers/messageRouter");
const auth = require("./routers/userRouter");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.listen(5000, console.log("Server running on port 5000."));

mongoose.connect(process.env.MDB_URI, (err) => {
  if (err) return console.error(err);
  else return console.log("Connected to whatappDB.");
});

app.use("/messages", message);
app.use("/auth", auth);
