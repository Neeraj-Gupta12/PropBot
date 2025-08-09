import express from "express";
import { allUsers, createUser, googleLogin, loginUser, resetPassword, updateUser } from "../Controllers/userController.js";
import { checkLogin } from "../Utils/jwt.js";
const userRouter = express.Router();

userRouter.post('/signup',createUser);
userRouter.post('/login',loginUser);
userRouter.post('/google',googleLogin);
userRouter.post('/update',checkLogin,updateUser)
userRouter.post('/reset-password', resetPassword);

export default userRouter;
