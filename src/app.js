import express from "express";
import "dotenv/config"

const app = express();
const PORT = process.env.PORT;

app.get("/api/v1/healthcheck", (_req, res) => {
  return res.json({
    message: "Trackr Backend Working..."
  })
})

app.listen(PORT, () => console.log(`Trackr Backend Unfortunately Running on port: ${PORT}  ;)`));
