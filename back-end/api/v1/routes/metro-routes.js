import express, { json } from 'express';
import { allFriends, updatePath } from '../../../controllers/metro-controller.js';

const router=express.Router();

router.get('/all-friends',allFriends);

router.post('/update-path',updatePath);

export default router;