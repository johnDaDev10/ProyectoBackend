import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export const productCollection = 'products'

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: [String],
    default: [],
  },
})

productSchema.plugin(mongoosePaginate)

export const ProductModel = mongoose.model(productCollection, productSchema)
