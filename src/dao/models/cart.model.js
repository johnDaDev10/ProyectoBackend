import mongoose from 'mongoose'
import { productCollection } from './product.model.js'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: productCollection,
        },
        quantity: {
          type: Number,
        },
      },
    ],
    default: [],
  },
})

cartSchema.pre('findOne', function (next) {
  this.populate('product') //probar products.product si no funciona
  next()
})

export const CartModel = mongoose.model(cartCollection, cartSchema)
