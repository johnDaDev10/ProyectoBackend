import { Router } from 'express'
import { __dirname } from '../../util/utils.js'
import ProductManager from '../../managers/ProductManager.js'

const productManager = new ProductManager(
  __dirname + '../../data/Products.json'
)

// Route -> /api/products/...
const router = Router()

router.get('/', async (req, res) => {
  const { limit } = req.query
  // console.log(+limit === 0)
  try {
    const products = await productManager.getProducts()

    if (!limit) {
      return res.status(200).send({
        message: `All produdcts found`,
        data: products,
      })
    }
    if (+limit > products.length || isNaN(limit) || +limit === 0) {
      return res.status(400).send({
        error:
          +limit > products.length || +limit === 0
            ? `Not enough products found`
            : `'${limit}' --> Invalid Data`,
      })
    }

    const limitProducts = products.slice(0, +limit)
    return res.status(200).send({
      message: `These are the ${limit} products found`,
      data: limitProducts,
    })
  } catch (error) {
    console.log('Error desde products Router get(/):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
})

router.get('/:pid', async (req, res) => {
  try {
    const products = await productManager.getProducts()
    const { pid } = req.params
    console.log(pid)
    const product = await productManager.getProductById(+pid)
    if (!product) {
      return res.status(400).send({
        error:
          +pid > products.length
            ? `The product with ID: ${pid} does'nt exist`
            : `'${pid}' --> Invalid Data`,
      })
    }
    return res.status(200).send({
      message: `Product found with id ${pid}`,
      data: product,
    })
  } catch (error) {
    console.log('Error desde products Router get(/:pid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
})

router.post('/', async (req, res) => {
  const product = req.body

  try {
    const newProduct = await productManager.addProduct(product)
    if (!newProduct) {
      return res.status(400).json({
        message: 'Error, Bad Request, Check The Data',
        error: 'Wrong Data',
      })
    }
    return res.status(200).json({
      message: `successfully added`,
      data: newProduct,
    })
  } catch (error) {
    console.log('Error desde products Router post(/):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
})

router.put('/:pid', async (req, res) => {
  const { pid } = req.params
  const newProperties = req.body
  try {
    const updatedProduct = await productManager.updateProduct(
      +pid,
      newProperties
    )
    if (!updatedProduct || isNaN(pid) || +pid === 0) {
      return res.status(400).send({
        error:
          !isNaN(pid) || +pid === 0
            ? `Not enough products found`
            : `'${pid}' --> Invalid Data`,
      })
    }
    return res.status(200).send({
      message: `Product successfully updated with id ${pid}`,
      data: updatedProduct,
    })
  } catch (error) {
    console.error('Error desde products Router put(/:pid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
})

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params
  try {
    const deletedProduct = await productManager.deleteProduct(+pid)
    if (!deletedProduct || isNaN(pid) || +pid === 0) {
      return res.status(400).send({
        error:
          !isNaN(pid) || +pid === 0
            ? `Not enough products found`
            : `'${pid}' --> Invalid Data`,
      })
    }
    return res.status(200).send({
      message: `Product successfully deleted with id ${pid}`,
      data: deletedProduct,
    })
  } catch (error) {
    console.error('Error desde products Router delete(/:pid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
})
export default router
