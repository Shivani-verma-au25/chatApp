import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message.controller.js";

const router = Router();

router.route('/users').get(protectedRoute , getUsersForSidebar)
router.route('/:id').get( protectedRoute , getMessages)

router.route('/send/:id').post(protectedRoute , sendMessages)


export default router;