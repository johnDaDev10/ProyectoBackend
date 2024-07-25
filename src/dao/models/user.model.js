import mongoose from 'mongoose'
import { cartCollection } from './cart.model.js'

export const userCollection = 'users'

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },

  age: {
    type: Number,
    required: true,
  },

  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cartCollection,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
})

export const UserModel = mongoose.model(userCollection, userSchema)
