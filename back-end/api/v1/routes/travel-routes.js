import express from "express";
import { updateTravelRoute } from "../../../controllers/travel-controller.js";
const router = express.Router();

router.put("/update", updateTravelRoute);

export default router;
