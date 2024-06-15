// import { __dirname } from '../../util/utils.js'
// import ProductManager from '../../dao/managers/fileSystemManager/ProductManagerFS.js'

// const productsManager = new ProductManager(
//   __dirname + '../../data/Products.json'
// )

import { Router } from 'express'
import ProductManager from '../../dao/managers/MongoDBManager/ProductManagerMongo.js'
import CartManager from '../../dao/managers/MongoDBManager/CartManagerMongo.js'

const viewsRouter = Router()

const productManager = new ProductManager()
const cartManager = new CartManager()

viewsRouter.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts()
    const data = {
      title: 'Productos desde views router',
      list: products.data,
    }
    // console.log(data)
    res.render('home', data)
  } catch (error) {
    console.log(error)
  }
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts()

    res.render('realTimeProducts', {
      title: 'Productos desde views router real time products',
    })
  } catch (error) {
    console.log(error)
  }
})

viewsRouter.get('/chat', (req, res) => {
  res.render('chat')
})

viewsRouter.get('/viewProducts', async (req, res) => {
  // const { limit = 10, page = 1, sort, ...query } = req.query
  // console.log(limit, page, sort, query)
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${
      req.path
    }`

    const products = await productManager.getProductsPaginate(
      req.query,
      baseUrl
    )
    // console.log(products)
    const info = {
      title: 'Products con Paginación',
      ...products.data,
    }
    // console.log(products.data.prevLink, products.data.nextLink)
    res.render('productsPaginate', info)
  } catch (error) {
    console.log(error)
  }
})

viewsRouter.get('/product/:pid', async (req, res) => {
  const { pid } = req.params
  try {
    const product = await productManager.getProductById(pid)
    const info = {
      title: 'Info Product',
      ...product,
    }
    // console.log(info)
    res.render('product', info)
  } catch (error) {
    console.log(error)
  }
})

viewsRouter.get('/viewCart/:cid', async (req, res) => {
  const { cid } = req.params
  try {
    const cart = await cartManager.getCartById(cid)
    const info = {
      title: 'View a shopping cart',
      ...cart,
    }

    // console.log(info.data)
    res.render('cart', info)
  } catch (error) {
    console.log(error)
  }
})

export default viewsRouter
