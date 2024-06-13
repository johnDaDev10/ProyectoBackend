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
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
})
cartSchema.pre('findOne', function (next) {
  this.populate('products.product', '_id title price')
  next()
})

export const CartModel = mongoose.model(cartCollection, cartSchema)
