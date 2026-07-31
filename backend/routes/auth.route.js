import express from "express"
import { login, logout, signup, getMe, syncClerkUser } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router()

router.post("/signup", signup) 
router.post("/login", login)  
router.post("/logout", logout) 
router.get("/me", protectRoute, getMe)
router.post("/sync", syncClerkUser)

export default router;