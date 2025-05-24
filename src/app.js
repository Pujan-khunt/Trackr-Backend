import express from "express";
import "dotenv/config"
import connectDB from "./config/connectDB.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;
connectDB();

app.use(cors())
app.use(express.json())

app.get("/api/v1/healthcheck", (_req, res) => {
  return res.json({
    message: "Trackr Backend Working..."
  })
})

import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users", userRouter)

app.listen(PORT, () => console.log(`Trackr Backend Unfortunately Running on port: ${PORT} ;)`));
