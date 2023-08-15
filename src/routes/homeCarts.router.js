import express from 'express';
import { isCartOwner, isUser } from '../middleware/auth.js';
import { ticketController } from '../controllers/tickets.controller.js';

export const cartsHtml = express.Router();

cartsHtml.get('/:cid', isUser, isCartOwner, ticketController.getCart);
cartsHtml.get('/:cid/purchase', ticketController.purchese);
cartsHtml.get('/:cid/purchase/ticket', ticketController.ticketEnd);