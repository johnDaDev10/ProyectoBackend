// import { __dirname } from '../../util/utils.js'
// import ProductManager from '../../dao/managers/fileSystemManager/ProductManagerFS.js'
// const productManager = new ProductManager(
//   __dirname + '../../data/Products.json'
// )

import { Router } from 'express'
import {
  createOneProduct,
  deleteOneProduct,
  getOneProduct,
  productsList,
  updateOneProduct,
} from '../../dao/controllers/productController.js'

// Route -> /api/products/...
const productsRouter = Router()

productsRouter.get('/', productsList)

productsRouter.get('/:pid', getOneProduct)

productsRouter.post('/', createOneProduct)

productsRouter.put('/:pid', updateOneProduct)

productsRouter.delete('/:pid', deleteOneProduct)

export default productsRouter
