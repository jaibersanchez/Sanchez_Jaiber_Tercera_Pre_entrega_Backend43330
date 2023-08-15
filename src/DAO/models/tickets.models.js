import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
  code: { type: String, unique: true },
  purchase_datetime: { type: Date },
  amount: { type: Number },
  purchaser: { type: String },
  products: [
    {
      idProduct: { type: Object },
      _id: false,
      quantity: { type: Number },
      totalPrice: { type: Number },
    },
  ],
});

ticketSchema.pre('find', function () {
  this.populate({ path: 'products', populate: { path: '_id', model: 'products' } });
});

ticketSchema.pre('findOne', function () {
  this.populate({ path: 'products', populate: { path: '_id', model: 'products' } });
});

export const TicketModel = model('tickets', ticketSchema);