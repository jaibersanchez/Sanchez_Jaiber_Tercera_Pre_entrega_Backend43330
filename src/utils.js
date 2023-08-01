
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from 'mongoose';
import 'dotenv/config';
import { Server } from 'socket.io';
import ProductManager from './DAO/fileSystem/productManager.js';
import { ChatModel } from './DAO/models/chat.model.js';
import bcrypt from 'bcrypt';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/public');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
export async function connectMongo() {
  try {
    await connect('mongodb+srv://' + MONGO_USER + ':' + MONGO_PASS + '@atlascluster.z0mmpcl.mongodb.net/?retryWrites=true&w=majority');
    console.log('Plug to mongo!');
  } catch (error) {
    console.log(error);
    throw 'can not connect to the DB';
  }
}

export function connectSocket(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on('connection', (socket) => {
    console.log('Un cliente se ha conectado ' + socket.id);

    socket.on('new-product', async (newProduct) => {
      const data = new ProductManager('./src/data/products.json');
      await data.addProduct(newProduct);

      const products = await data.getProducts();
      console.log(products);
      socketServer.emit('products', products);
    });

    socket.on('delete-product', async (productId) => {
      const data = new ProductManager('./src/data/products.json');
      await data.deleteProduct(productId);

      const products = await data.getProducts();
      socketServer.emit('products', products);
    });


    socket.on('msg_front_to_back', async (msg) => {
      const msgCreated = await ChatModel.create(msg);
      const msgs = await ChatModel.find({});
      socketServer.emit('msg_back_to_front', msgs);
    });
  });
}


export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);