import express from "express";

import { login, signup } from "../controllers/auth.js";
import { getAllUsers, updateProfile, getUserLoginHistory } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/login-history', auth, getUserLoginHistory);

router.get("/getAllUsers", getAllUsers);
router.patch("/update/:id", auth, updateProfile);

export default router;
