import express from 'express';
import { generateProduct } from './utils.js';
import { ProductService } from './services/products.service.js';
const productService = new ProductService();

export const testFaker = express.Router();

testFaker.get('/', (req, res) => {
  const products = [];
  for (let i = 0; i < 50; i++) {
    products.push(generateProduct());
  }

  return res.send({
    status: 'success',
    payload: products,
  });
});

testFaker.post('/', (req, res) => {
  const products = [];
  for (let i = 0; i < 50; i++) {
    products.push(generateProduct());
  }

  const product = req.body;
  const { title, description, price, thumbnail, code, stock, category, status } = product;
  productService.validateProduct(title, description, price, thumbnail, code, stock, category, status);

  products.push(product);

  return res.send({
    status: 'success',
    payload: product,
  });
});