// import { __dirname } from '../../util/utils.js'
// import ProductManager from '../../dao/managers/fileSystemManager/ProductManagerFS.js'

// const productsManager = new ProductManager(
//   __dirname + '../../data/Products.json'
// )

import { Router } from 'express'
import ProductManager from '../../dao/managers/MongoDBManager/ProductManagerMongo.js'
import CartManager from '../../dao/managers/MongoDBManager/CartManagerMongo.js'
import { sessionMiddleware } from '../../middleware/session.middleware.js'
import { auth } from '../../middleware/auth.middleware.js'

const viewsRouter = Router()

const productManager = new ProductManager()
const cartManager = new CartManager()

viewsRouter.get('/', sessionMiddleware, async (req, res) => {
  res.render('login')
})

viewsRouter.get('/register', sessionMiddleware, async (req, res) => {
  res.render('register')
})

viewsRouter.get('/error404', async (req, res) => {
  try {
    res.render('error404')
  } catch (error) {
    console.log(error)
  }
})

viewsRouter.get('/home', async (req, res) => {
  try {
    const user = await req.session.user
    const products = await productManager.getProducts()
    const data = {
      title: 'Productos desde views router',
      user: user,
      list: products.data,
    }
    // console.log(data)
    res.render('home', data)
  } catch (error) {
    console.log(error)
  }
})

viewsRouter.get('/realtimeproducts', auth, async (req, res) => {
  try {
    const products = await productManager.getProducts()
    const user = await req.session.user

    res.render('realTimeProducts', {
      title: 'Productos desde views router real time products',
      user: user,
    })
  } catch (error) {
    console.log(error)
  }
})

viewsRouter.get('/chat', auth, async (req, res) => {
  try {
    const user = await req.session.user
    res.render('chat', { user })
  } catch (error) {
    console.log(error)
  }
})

viewsRouter.get('/viewProducts', auth, async (req, res) => {
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
      user: req.session.user,
      ...products.data,
    }
    // console.log(products.data.prevLink, products.data.nextLink)
    res.render('productsPaginate', info)
  } catch (error) {
    console.log(error)
    res.status(500).render('error404')
  }
})

viewsRouter.get('/product/:pid', auth, async (req, res) => {
  const { pid } = req.params
  try {
    const user = await req.session.user
    const product = await productManager.getProductById(pid)
    const info = {
      title: 'Info Product',
      user: user,
      ...product,
    }
    // console.log(info)
    res.render('product', info)
  } catch (error) {
    console.log(error)
  }
})

viewsRouter.get('/viewCart/:cid', auth, async (req, res) => {
  const { cid } = req.params
  try {
    const user = await req.session.user
    const cart = await cartManager.getCartById(cid)
    const info = {
      title: 'View a shopping cart',
      user: user,
      ...cart,
    }

    // console.log(info.data)
    res.render('cart', info)
  } catch (error) {
    console.log(error)
  }
})

viewsRouter.get('/profile', auth, async (req, res) => {
  try {
    const user = await req.session.user
    res.render('profile', { user })
  } catch (error) {
    console.log(error)
  }
})

export default viewsRouter
