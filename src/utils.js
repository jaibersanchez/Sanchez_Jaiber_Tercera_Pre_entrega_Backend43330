import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { connect } from 'mongoose';
import { Server } from 'socket.io';
import { ChatModel } from './DAO/models/chat.model.js';
import { ProductService } from './services/products.service.js';
import { ProductModel } from './DAO/models/products.model.js';
import bcrypt from 'bcrypt';
import { Faker, es } from '@faker-js/faker';

/*********************** Multer ***********************/


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/public');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

/***************************** __dirname *****************************/

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

/***************************** Connect to Mongo *****************************/

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;

export async function connectMongo() {
  try {
    await connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@atlascluster.z0mmpcl.mongodb.net/?retryWrites=true&w=majority`);
    console.log('Plug to mongo!');
  } catch (error) {
    console.log(error);
    throw 'can not connect to the DB';
  }
}

/******************************* Socket *******************************/

const Products = new ProductService();

export function connectSocket(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on('connection', (socket) => {
    console.log('Un cliente se ha conectado ' + socket.id);

    /*************** Add and Delete Products ***************/
    socket.on('new-product', async (newProduct) => {
      try {
        const { title, description, price, thumbnail, code, stock, category, status } = newProduct;
        await Products.createOne(title, description, price, thumbnail, code, stock, category, status);
        const allProducts = await ProductModel.find({});
        const products = allProducts.map((product) => {
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

        console.log('desde utils');
        socketServer.emit('products', products);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('delete-product', async (idProduct) => {
      try {
        await Products.deleteOne(idProduct);

        const allProducts = await ProductModel.find({});
        const products = allProducts.map((product) => {
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

        socketServer.emit('products', products);
      } catch (error) {
        console.log(error);
      }
    });

    /******************** Chat Message ********************/
    /* Back recibe */
    socket.on('msg_front_to_back', async (msg) => {
      const msgCreated = await ChatModel.create(msg);
      const msgs = await ChatModel.find({});
      socketServer.emit('msg_back_to_front', msgs);
    });
  });
}

/******************************* BCrypt *******************************/

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

/******************************* FakerJS *******************************/


const faker = new Faker({ locale: [es] });

export function generateUser() {
  let numOfProducts = parseInt(faker.string.numeric(1, { bannedDigits: ['0'] }));
  let products = [];
  for (let i = 0; i < numOfProducts; i++) {
    products.push(generateProduct());
  }

  const roleFaker = faker.helpers.arrayElement(['cliente', 'vendedor']);

  return {
    name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    sex: faker.person.sexType(),
    birthDate: faker.date.birthdate(),
    phone: faker.phone.number(),
    image: faker.internet.avatar(),
    id: faker.database.mongodbObjectId(),
    email: faker.internet.email(),
    ocupation: faker.person.jobType(),
    isPremium: faker.datatype.boolean(0.9),
    role: roleFaker,
    products,
  };
}

export function generateProduct() {
  const productStatus = faker.helpers.arrayElement([true, false]);
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    /* description: faker.commerce.productDescription(), */
    price: faker.commerce.price(),
    thumbnail: faker.internet.avatar(),
    code: faker.string.alphanumeric(5),
    stock: faker.string.numeric(1),
    category: faker.commerce.department(),
    status: productStatus,
  };
}