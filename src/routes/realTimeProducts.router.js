import express from 'express';
import { ProductModel } from '../DAO/models/products.model.js';
import { isAdmin } from '../middleware/auth.js';

export const productsRealTime = express.Router();

productsRealTime.get('/', isAdmin, async (req, res) => {
  try {
    const productsAll = await ProductModel.find({});
    const products = productsAll.map((product) => {
      return {
        title: product.title,
        id: product._id,
        description: product.description,
        price: product.price,
        code: product.code,
        stock: product.stock,
        category: product.category,
        thumbnail: product.thumbnail,
      };
    });
    return res.status(200).render('realTimeProducts', { products });
  } catch (error) {
    console.log(error);
  }
});