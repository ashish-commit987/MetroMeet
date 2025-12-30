import express from "express";
import { findMatches } from "../../../controllers/match-controller.js";

const router = express.Router();

router.get("/find", findMatches);

export default router;
