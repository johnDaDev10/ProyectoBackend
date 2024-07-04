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

    const { quantity } = req.body || 1

    // console.log(quantity)
    const addProductToCart = await cartManager.addProduct(cid, pid, quantity)

    res.status(addProductToCart.code).json({
      message: addProductToCart.message,
      data: addProductToCart.data,
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

export const deleteProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params

    const deleteProduct = await cartManager.deleteProductCart(cid, pid)

    res.status(deleteProduct.code).json({
      message: deleteProduct.message,
      data: deleteProduct.data,
    })
  } catch (error) {
    console.log('Error desde carts Router delete(/:cid/product/:pid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export const updateProductsCart = async (req, res) => {
  try {
    const { cid } = req.params

    const { products } = req.body

    // console.log(quantity)
    const updatedCart = await cartManager.updateCart(cid, products)

    res.status(updatedCart.code).json({
      message: updatedCart.message,
      data: updatedCart.data,
    })
  } catch (error) {
    console.log('Error desde carts Router post(/:cid/product/:pid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export const updateQuantityProductCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const { quantity } = req.body

    // console.log(quantity)
    const updatedCart = await cartManager.updateQuantityProduct(
      cid,
      pid,
      quantity
    )

    res.status(updatedCart.code).json({
      message: updatedCart.message,
      data: updatedCart.data,
    })
  } catch (error) {
    console.log('Error desde carts Router post(/:cid/product/:pid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export const deleteAllProductsInCart = async (req, res) => {
  const { cid } = req.params
  try {
    const getCartId = await cartManager.deleteAllProducts(cid) //no es necesario el populate por el .pre('findOne) del schema
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
