// import { __dirname } from '../../util/utils.js'
// import ProductManager from '../../dao/managers/fileSystemManager/ProductManagerFS.js'
// import CartManager from '../../dao/managers/fileSystemManager/CartManagerFS.js'
// const productManager = new ProductManager(
//   __dirname + '../../data/Products.json'
// )
// const cartManager = new CartManager(__dirname + '../../data/Carts.json')

import { Router } from 'express'
import {
  addProductToCart,
  cartsList,
  createNewCart,
  deleteProductToCart,
  productsInCart,
} from '../../dao/controllers/cartController.js'

const cartsRouter = Router()

cartsRouter.get('/', cartsList)

cartsRouter.get('/:cid', productsInCart)

cartsRouter.post('/:cid/product/:pid', addProductToCart)

cartsRouter.post('/', createNewCart)

cartsRouter.delete('/:cid/product/:pid', deleteProductToCart)

cartsRouter.delete('/:cid')

cartsRouter.put('/:cid')

cartsRouter.put('/:cid/product/:pid')

export default cartsRouter
