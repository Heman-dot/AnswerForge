import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
import users from "./models/auth.js"
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import springedge from 'springedge';

dotenv.config();

import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import connectDB from "./connectMongoDb.js";



// Connect to the database
connectDB();

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);

app.use(bodyParser.json());



// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PWD,
  },
});

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
  const { method, contact } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); 
  if (method === 'sms') {
    const phoneNumber = `+91${contact}`;
    const params = {
      'sender': process.env.SPRING_EDGE_SENDER_ID,
      'apikey': process.env.SPRING_EDGE_API_KEY,
      'to': `${phoneNumber}`,
      'message': `Mobile Number verification code is ${otp} Do not share it`,
      'format': 'json'
    };

    springedge.messages.send(params, 5000, (err, response) => {
      if (err) {
        console.error('Error sending OTP via SMS:', err);
        return res.status(500).json({ success: false, error: err.message });
      }
      console.log('Spring Edge Response:', response);
      res.json({ success: true, otp });
    });

  } else if (method === 'email') {
    // Send OTP via Email using Nodemailer 
    const mailOptions = {
      from: process.env.NODEMAILER_USER, 
      to: contact,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ success: false, error: error.message });
      } else {
        res.json({ success: true, otp });
      }
    });
  } else {
    res.status(400).json({ success: false, error: 'Invalid OTP method' });
  }
});


app.post("/sendEmail", async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.OTP;

    const check = await users.findOne({ email: email });

    if (check) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NODEMAILER_USER, 
          pass: process.env.NODEMAILER_PWD,
        },
      });

      const mailOptions = {
        from: "hemannarayanan_e@srmap.edu.in",
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
