import express from 'express';
import userRoutes from'./user-routes.js';
import metroRoutes from'./metro-routes.js';
import { auth } from '../../../utils/middlewares/auth.js';
import otpRoutes from './otp-routes.js';
import matchRoutes from "./match-routes.js";
import travelRoutes from "./travel-routes.js";

export const indexRoute = express.Router();
indexRoute.use('/user', userRoutes);
indexRoute.use('/otp', otpRoutes);
indexRoute.use('/metro', auth, metroRoutes);
indexRoute.use("/match", auth, matchRoutes);    
indexRoute.use("/travel", auth, travelRoutes);  
