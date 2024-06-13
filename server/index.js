import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
import users from "./models/auth.js"
import bcrypt from 'bcryptjs';

dotenv.config();

import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import connectDB from "./connectMongoDb.js";

// Load environment variables from .env file


// Connect to the database
connectDB();

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);

app.post("/sendEmail", async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.OTP;

    const check = await users.findOne({ email: email });

    if (check) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NODEMAILER_USER, // replace with your email address
          pass: process.env.NODEMAILER_PWD, // replace with your email password or app password
        },
      });

      const mailOptions = {
        from: "hemannarayanan_e@srmap.edu.in", // replace with your email address
        to: email,
        subject: "Password Reset",
        text: `The code to create a new password for the StackoverFlow account is ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.json("fail");
        } else {
          res.json("pass");
        }
      });
    } else {
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});

app.post("/resetpassword", async (req, res) => {
  const {email,password} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newPass = hashedPassword;
    await users.updateOne(
      { email: email },
      { $set: { password: newPass } }
    );

    res.json("pass");
  } catch (e) {
    res.json("fail");
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
