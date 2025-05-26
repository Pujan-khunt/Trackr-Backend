import type { Request, Response } from "express";
import express from "express";
import "dotenv/config"
import connectDB from "./config/connectDB.js";
import cors from "cors";

const app = express();
const PORT: string = process.env.PORT ?? "3000";

app.use(cors())
app.use(express.json())

type HealthCheckResponseType = {
  message: string
}

app.get("/api/v1/healthcheck", (_req: Request<{}, HealthCheckResponseType>, res: Response<HealthCheckResponseType>) => {
  res.json({
    message: "Trackr Backend Working..."
  })
})

import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users", userRouter)

connectDB();
app.listen(PORT, () => console.log(`Trackr Backend Unfortunately Running on port: ${PORT} ;)`));
