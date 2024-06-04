import { Router } from 'express'
import { __dirname } from '../../util/utils.js'
import ProductManager from '../../dao/managers/fileSystemManager/ProductManagerFS.js'

const productsManager = new ProductManager(
  __dirname + '../../data/Products.json'
)

const viewsRouter = Router()

viewsRouter.get('/', async (req, res) => {
  const products = await productsManager.getProducts()
  const data = {
    title: 'Productos desde views router',
    list: products,
  }
  res.render('home', data)
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
  const products = await productsManager.getProducts()

  res.render('realTimeProducts', {
    title: 'Productos desde views router real time products',
  })
})

export default viewsRouter
