import { ProductModel } from '../DAO/models/products.model.js';
import { ProductClass } from '../DAO/classes/products.class.js';
import CustomError from './errors/CustomError.js';
import { generateUserErrorInfo } from './errors/info.js';
import { EError } from './errors/enums.js';

const productClass = new ProductClass();

export class ProductService {
  validateProduct(title, description, price, thumbnail, code, stock, category, status = true) {
    if (!title || !description || !price || !thumbnail || !code || !stock || !category || !status) {
      /* console.log('Validation error: please complete all fields');
      throw new Error('Validation error: please complete all fields'); */
      CustomError.createError({
        name: 'User creation error',
        cause: generateUserErrorInfo(title, description, price, thumbnail, code, stock, category, (status = true)),
        message: 'Error trying to create user',
        code: EError.INCOMPLETE_FIELD_ERROR,
      });
    }
  }

  async getProducts(limit, page, category, sort) {
    const queryCategory = category ? { category: category } : {};

    let querySort = {};
    if (sort == 'asc') {
      querySort = { price: 1 };
    } else if (sort == 'desc') {
      querySort = { price: -1 };
    } else {
      querySort = {};
    }

    const productsPaginate = await ProductModel.paginate(queryCategory, { limit: limit || 5, page: page || 1, sort: querySort });

    //Creo e Incorporo los link prev y next antes de devolver todo
    productsPaginate.prevLink = productsPaginate.prevPage ? `/api/products?page=${productsPaginate.prevPage}` : null;
    productsPaginate.nextLink = productsPaginate.nextPage ? `/api/products?page=${productsPaginate.nextPage}` : null;

    return productsPaginate;
  }

  async getOneById(id) {
    const product = await productClass.getOneById(id);
    return product;
  }

  async createOne(title, description, price, thumbnail, code, stock, category, status) {
    this.validateProduct(title, description, price, thumbnail, code, stock, category, status);
    const productCreated = await productClass.createOne(title, description, price, thumbnail, code, stock, category, status);
    return productCreated;
  }

  async deleteOne(id) {
    try {
      const deleted = await productClass.deleteOne(id);
      return deleted;
    } catch (error) {
      console.log(error);
    }
  }

  async updateOne(id, title, description, price, thumbnail, code, stock, category, status) {
    if (!id) throw new Error('Invalid _id');
    this.validateProduct(title, description, price, thumbnail, code, stock, category, status);
    const productUptaded = await productClass.updateOne(id, title, description, price, thumbnail, code, stock, category, status);
    return productUptaded;
  }
}