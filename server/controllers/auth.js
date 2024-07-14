import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import  uaParser from 'ua-parser-js';
import users from "../models/auth.js";
import dotenv from "dotenv";
dotenv.config();


export const signup = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await users.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber  
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    console.log({ headers: req.headers });

    const userAgent = uaParser(req.headers['user-agent']);
    const ip = req.ip;
    const browser = userAgent.browser.name;
    const os = userAgent.os.name;
    const device = userAgent.device.type || 'desktop';

    const loginTime = new Date();
    existingUser.loginHistory.push({ ip, browser, os, device,loginTime });
    await existingUser.save();

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};
