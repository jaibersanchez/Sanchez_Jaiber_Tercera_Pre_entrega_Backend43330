import express from 'express';
import { isNotAdmin, isUser } from '../middleware/auth.js';

export const chatRouter = express.Router();

chatRouter.get('/', isUser, isNotAdmin, (req, res) => {
  return res.render('chat', {});
});