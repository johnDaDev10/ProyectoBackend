import CartManager from '../managers/MongoDBManager/CartManagerMongo.js'

const cartManager = new CartManager()

export const productsInCart = async (req, res) => {
  const { cid } = req.params
  try {
    const getCartId = await cartManager.getCartById(cid) //no es necesario el populate por el .pre('findOne) del schema
    res.status(getCartId.code).json({
      message: getCartId.message,
      data: getCartId.data,
    })
  } catch (error) {
    console.log('Error desde Carts Router get(/:cid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    // console.log(cid, pid)
    const { quantity } = req.body
    // const cart = await cartManager.getCartById(+cid)
    // const product = await productManager.getProductById(+pid)

    // if (!cart || !product) {
    //   return res.status(400).json({
    //     message: !cart
    //       ? `Bad Request, Cart with id ${cid} not Found`
    //       : `Bad Request, Product with id ${pid} not Found`,
    //   })
    // }

    const AddProductToCart = await cartManager.addProduct(cid, pid, quantity)

    res.status(AddProductToCart.code).json({
      message: AddProductToCart.message,
      data: AddProductToCart.data,
    })
  } catch (error) {
    console.log('Error desde carts Router post(/:cid/product/:pid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export const createNewCart = async (req, res) => {
  try {
    const newCart = await cartManager.addCart()
    res.status(newCart.code).json({
      message: newCart.message,
      data: newCart.data,
    })
  } catch (error) {
    console.log('Error desde carts Router post(/):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export const cartsList = async (req, res) => {
  try {
    const carts = await cartManager.getCarts()
    res.status(carts.code).json({
      message: carts.message,
      data: carts.data,
    })
  } catch (error) {
    console.log('Error desde Carts Router get(/:cid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}
