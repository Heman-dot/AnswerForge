import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
import users from "./models/auth.js"
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import springedge from 'springedge';
import  uaParser from 'ua-parser-js';

dotenv.config();

import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import connectDB from "./connectMongoDb.js";


connectDB();

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);

app.use(bodyParser.json());



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PWD,
  },
});

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
    const mailOptions = {
      from: process.env.NODEMAILER_USER, 
      to: contact,
      subject: 'Your OTP Code',
      text: `Your OTP code for email verification is ${otp}`,
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
    const contact = req.body.contact;
    const otp = req.body.OTP;

    const isEmail = /\S+@\S+\.\S+/.test(contact);

    const check = isEmail
      ? await users.findOne({ email: contact })
      : await users.findOne({ phoneNumber: contact });

    if (check) {
      if (isEmail) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PWD,
          },
        });

        const mailOptions = {
          from: process.env.NODEMAILER_USER,
          to: contact,
          subject: 'Password Reset',
          text: `The code to create a new password for the StackoverFlow account is ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.json('fail');
          } else {
            res.json('pass');
          }
        });
      }
      else{
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
        res.json('fail');
        console.error('Error sending OTP via SMS:', err);
        return res.status(500).json({ success: false, error: err.message });
      }
      console.log('Spring Edge Response:', response);
      res.json('pass');
    });

      }
    } else {
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});

app.post("/resetpassword", async (req, res) => {
  const { contact, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const isEmail = /\S+@\S+\.\S+/.test(contact);
    const filter = isEmail ? { email: contact } : { phoneNumber: contact };

    const user = await users.findOne(filter);
    if (!user) {
      console.log("User does not exist");
      return res.json("notexist");
    }

    const update = await users.updateOne(filter, { $set: { password: hashedPassword } });

    if (update.modifiedCount > 0) {
      console.log("Password updated successfully");
      res.json("pass");
    } else {
      console.log("Password update failed");
      res.json("fail");
    }
  } catch (e) {
    console.error(`Error updating password: ${e.message}`);
    res.json("fail");
  }
});


app.post("/chrome-verify",async(req , res) =>{
  const { method, contact, pass } = req.body;
  const existingUser = await users.findOne({ email:contact });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(pass, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  const userAgent = uaParser(req.headers['user-agent']);
  const browser = userAgent.browser.name;
  if(browser !== "Chrome"){
    res.json({ success: true, browser });
  }
  else{
    const otp = Math.floor(100000 + Math.random() * 900000); 
  if (method === 'email') {
    const mailOptions = {
      from: process.env.NODEMAILER_USER, 
      to: contact,
      subject: 'Your OTP Code',
      text: `Your OTP code for verification is ${otp}`,
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

  }
  
})

const PORT = process.env.PORT || 8080;
  
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
