import { userDTO } from '../DAO/DTO/user.dto.js';
import { CartClass } from '../DAO/classes/carts.class.js';
import { ProductClass } from '../DAO/classes/products.class.js';
import { TicketModel } from '../DAO/models/tickets.models.js';
import { CartService } from '../services/carts.service.js';
const cartService = new CartService();
const cartClass = new CartClass();
const productClass = new ProductClass();

class TicketsController {
  async getCart(req, res) {
    try {
      const { cid } = req.params;
      const cartFound = await cartClass.findCartById(cid);
      if (!cartFound) {
        throw new Error('Cart not found');
      }

      const idCart = cartFound._id;

      let cart = cartFound.products.map((item) => {
        return {
          title: item._id.title,
          price: item._id.price,
          quantity: item.quantity,
        };
      });

      return res.status(200).render('carts', { cart: cart, idCart });
    } catch (error) {
      console.log(error);
    }
  }

  async purchese(req, res) {
    try {
      const { cid } = req.params;
      const infoUser = new userDTO(req.session);
      const cartFound = await cartClass.findCartById(cid);
      if (!cartFound) {
        throw new Error('Cart not found');
      }

      const idCart = cartFound._id;

      // Calcula el total de la compra
      let cart = cartFound.products.map((item) => {
        return {
          id: item._id._id,
          title: item._id.title,
          price: item._id.price,
          quantity: item.quantity,
        };
      });
      console.log('devuelve lo de adentro del cart', cart);

      let precioTotal = 0;
      cart.forEach((producto) => {
        precioTotal += producto.price * producto.quantity;
      });

      return res.status(200).render('purchase', { cart: cart, idCart, infoUser, precioTotal });
    } catch (error) {
      console.log(error);
    }
  }

  async ticketEnd(req, res) {
    try {
      const { cid } = req.params;
      const infoUser = new userDTO(req.session);
      const infoUserEmail = req.session.email;
      const cartFound = await cartClass.findCartById(cid);
      if (!cartFound) {
        throw new Error('Cart not found');
      }

      const idCart = cartFound._id;

      let cartConStock = [];
      let cartSinStock = [];

      /* Separo los productos con Stock y Sin stock */
      cartFound.products.forEach((item) => {
        const idProduct = item._id._id.toString();
        const title = item._id.title;
        const quantityInCart = parseInt(item.quantity);
        const availableStock = parseInt(item._id.stock);
        const productPrice = parseInt(item._id.price);

        if (quantityInCart <= availableStock) {
          const precioTotalProducto = productPrice * quantityInCart;
          cartConStock.push({ idProduct, quantity: quantityInCart, precioTotalProducto, title });
          const product = productClass.getOneById(idProduct);
          let quantityTotal = availableStock - quantityInCart;
          productClass.updateOne(
            idProduct,
            product.title,
            product.description,
            product.price,
            product.thumbnails,
            product.code,
            quantityTotal,
            product.category,
            product.status
          );
        } else {
          cartSinStock.push({ idProduct, quantity: quantityInCart });
        }
      });

      let precioTotal = 0;
      cartConStock.forEach((producto) => {
        precioTotal += producto.precioTotalProducto * producto.quantity;
      });

      let cart = cartConStock.map((item) => {
        return {
          id: item.idProduct,
          quantity: item.quantity,
          price: item.precioTotalProducto,
          title: item.title,
        };
      });

      const ticketData = {
        code: '',
        purchase_datetime: new Date(),
        amount: precioTotal,
        purchaser: infoUserEmail,
        products: cart,
      };

      let ticket = await TicketModel.create(ticketData);
      let code = ticket._id.toString();
      await TicketModel.findByIdAndUpdate(ticket._id, { code: code });
      await cartService.cleanCart(idCart);
      const idTicket = ticket._id;
      return res.status(200).render('ticketFinal', { idTicket, cart: cart, idCart, infoUser, precioTotal });
    } catch (error) {
      console.log(error);
    }
  }
}

export const ticketController = new TicketsController();