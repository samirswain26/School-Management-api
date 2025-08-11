import express from "express";
import { addSchool, listSchools } from "../controllers/schools.controllers.js";

const Schoolrouter = express.Router();


Schoolrouter.post("/addSchool", addSchool);
Schoolrouter.get("/listSchools", listSchools);

export default Schoolrouter;
