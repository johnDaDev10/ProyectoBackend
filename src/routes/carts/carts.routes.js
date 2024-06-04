import { Router } from 'express'
import { __dirname } from '../../util/utils.js'
import ProductManager from '../../dao/managers/fileSystemManager/ProductManagerFS.js'
import CartManager from '../../dao/managers/fileSystemManager/CartManagerFS.js'

const productManager = new ProductManager(
  __dirname + '../../data/Products.json'
)
const cartManager = new CartManager(__dirname + '../../data/Carts.json')

const cartsRouter = Router()

cartsRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params
  try {
    const getCartId = await cartManager.getCartById(+cid) //no es necesario el populate por el .pre('findOne) del schema
    if (!getCartId) {
      return res.status(400).json({
        error: `Bad Request, Cart with id ${cid} not Found`,
      })
    }
    res.status(200).json({
      message: `Success, There is a Cart with id ${cid}`,
      data: getCartId,
    })
  } catch (error) {
    console.log('Error desde Carts Router get(/:cid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params
    const cart = await cartManager.getCartById(+cid)
    const product = await productManager.getProductById(+pid)

    if (!cart || !product) {
      return res.status(400).json({
        message: !cart
          ? `Bad Request, Cart with id ${cid} not Found`
          : `Bad Request, Product with id ${pid} not Found`,
      })
    }

    const AddProductToCart = await cartManager.addProduct(+cid, +pid)

    res.status(200).json({
      message: `Successfully added product with id ${pid} to the cart with id ${cid}`,
      data: AddProductToCart,
    })
  } catch (error) {
    console.log('Error desde carts Router post(/:cid/product/:pid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
})

cartsRouter.post('/', async (req, res) => {
  try {
    const ifBodyValues = JSON.stringify(req.body)
    // console.log(ifBodyValues)
    // console.log(ifBodyValues.length)
    if (ifBodyValues.length > 2) {
      return res.status(401).json({
        message: 'Error, Unauthorized, it is restricted to enter  attributes',
        error: 'params entered by unauthorized person',
      })
    }
    const cart = await cartManager.addCart()
    res.status(200).json({
      message: `Successfully added`,
      data: cart,
    })
  } catch (error) {
    console.log('Error desde carts Router post(/):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
})

export default cartsRouter
