import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { connectionDB } from "./config/db.js";
import Schoolrouter from "./routes/school.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Welcome to school provider.");
});

app.use("/api/", Schoolrouter);

connectionDB()
  .then(() => {
    app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
  })
  .catch((err) => {
    console.error(`MySql connection error`, err);
    process.exit(1);
  });
