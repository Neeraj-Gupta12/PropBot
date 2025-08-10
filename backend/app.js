import express from "express";
import userRouter from "./Routes/userRoutes.js";
import propertyRouter from "./Routes/propertyRoutes.js";
import { errorMiddleware } from "./middleware/error.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRouter);
app.use('/api', propertyRouter);

// Error handling middleware (should be last)
app.use(errorMiddleware);

export default app;