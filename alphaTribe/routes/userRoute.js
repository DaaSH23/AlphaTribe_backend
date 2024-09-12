import express from "express";
import { logoutUser, saveUser, updateUser, userLogin, userProfileDetails } from "../controllers/authController.js";
import { authorization } from "../middleware/authenticate.js";

const router = express.Router();

// Register user endpoint 
router.route("/auth/register").post(saveUser);
router.route("/auth/login").post(userLogin);
router.get("/user/profile", authorization, userProfileDetails);
router.put("/user/profile", authorization, updateUser);
router.get("/auth/logout", authorization, logoutUser);

export default router;