import { ProductModel } from '../models/products.model.js';

export class ProductClass {
  async getOneById(id) {
    const product = await ProductModel.findOne({ _id: id });
    return product;
  }

  async createOne(title, description, price, thumbnail, code, stock, category, status) {
    const productCreated = await ProductModel.create({ title, description, price, thumbnail, code, stock, category, status });
    return productCreated;
  }

  async deleteOne(id) {
    const deleted = await ProductModel.deleteOne({ _id: id });
    return deleted;
  }

  async updateOne(id, title, description, price, thumbnail, code, stock, category, status) {
    const productUptaded = await ProductModel.updateOne({ _id: id }, { title, description, price, thumbnail, code, stock, category, status });
    return productUptaded;
  }
}