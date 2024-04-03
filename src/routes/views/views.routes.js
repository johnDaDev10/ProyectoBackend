import { Router } from 'express'
import { __dirname } from '../../util/utils.js'
import ProductManager from '../../managers/ProductManager.js'

const router = Router()
const productsManager = new ProductManager(
  __dirname + '../../data/Products.json'
)

router.get('/', async (req, res) => {
  const products = await productsManager.getProducts()
  const data = {
    title: 'Productos desde views router',
    list: products,
  }
  res.render('home', data)
})

router.get('/realtimeproducts', async (req, res) => {
  const products = await productsManager.getProducts()

  res.render('realTimeProducts', {
    title: 'Productos desde views router real time products',
  })
})

export default router
