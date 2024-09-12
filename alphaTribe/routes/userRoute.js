import express from "express";
import { logoutUser, saveUser, userLogin } from "../controllers/authController.js";
import { authorization } from "../middleware/authenticate.js";

const router = express.Router();

// Register user endpoint 
router.route("/auth/register").post(saveUser);
router.route("/auth/login").post(userLogin);
router.get("/auth/logout", authorization, logoutUser);

export default router;