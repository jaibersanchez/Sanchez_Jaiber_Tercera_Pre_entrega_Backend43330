import { CartModel } from '../models/carts.models.js';

export class CartClass {
  async getAll() {
    try {
      const cart = await CartModel.find({});
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async createCart() {
    try {
      const cart = await CartModel.create({});
      return cart;
    } catch (err) {
      throw err;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async cleanCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart;
  }

  async findCartById(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart;
  }
}