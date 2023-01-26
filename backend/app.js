import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";

dotenv.config();
const app = express();

// starting server
const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => console.log("Server has started on port 8080"));
  } catch (error) {
    console.log(error);
  }
};
startServer();

// middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// routes
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);
