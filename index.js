import express from "express";
import dotenv from "dotenv";
import connectionDB from "./config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//   console.log(`App is listening at port ${PORT}`);
// });

app.get("/", (req, res) => {
  res.send("Welcome to Homepage🔥");
});

connectionDB()
  .then(() => {
    app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
  })
  .catch((err) => {
    console.error(`MySql connection error`, err);
    process.exit(1);
    // For seek this catch will never run because in db file "connectdb" already get exit in catch.
  });
