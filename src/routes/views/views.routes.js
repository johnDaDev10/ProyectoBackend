// import { __dirname } from '../../util/utils.js'
// import ProductManager from '../../dao/managers/fileSystemManager/ProductManagerFS.js'

// const productsManager = new ProductManager(
//   __dirname + '../../data/Products.json'
// )

import { Router } from 'express'
import ProductManager from '../../dao/managers/MongoDBManager/ProductManagerMongo.js'

const viewsRouter = Router()

const productManager = new ProductManager()

viewsRouter.get('/', async (req, res) => {
  const products = await productManager.getProducts()
  const data = {
    title: 'Productos desde views router',
    list: products.data,
  }
  // console.log(data)
  res.render('home', data)
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts()

  res.render('realTimeProducts', {
    title: 'Productos desde views router real time products',
  })
})

viewsRouter.get('/chat', (req, res) => {
  res.render('chat')
})

export default viewsRouter
