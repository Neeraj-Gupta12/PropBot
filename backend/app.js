import express from "express";
import userRouter from "./Routes/userRoutes.js";
import propertyRouter from "./Routes/propertyRoutes.js";
// import chatbotRouter from "./Routes/chatbotRoutes.js";
import { errorMiddleware } from "./middleware/error.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRouter);
app.use('/api', propertyRouter);
// app.use('/api/chatbot', chatbotRouter);

// Error handling middleware (should be last)
app.use(errorMiddleware);

export default app;