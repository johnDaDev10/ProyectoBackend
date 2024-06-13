import ProductManager from '../managers/MongoDBManager/ProductManagerMongo.js'

const productManager = new ProductManager()

export const productsList = async (req, res) => {
  const { limit = 10, page = 1, sort, ...query } = req.query

  try {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${
      req.path
    }`
    // console.log(baseUrl)
    const products = await productManager.getProductsPaginate(
      limit,
      page,
      sort,
      query,
      baseUrl
    )
    // console.log(limit, page, sort, query, baseUrl)

    return res.status(products.code).send({
      message: products.message,
      data: products.data,
    })
  } catch (error) {
    console.log('Error desde products Router get(/):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export const getOneProduct = async (req, res) => {
  try {
    const { pid } = req.params

    const product = await productManager.getProductById(pid)
    return res.status(product.code).send({
      message: product.message,
      data: product.data,
    })
  } catch (error) {
    console.log('Error desde products Router get(/:pid):', error)
    return res.status(product.code).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export const createOneProduct = async (req, res) => {
  const product = req.body

  try {
    const newProduct = await productManager.addProduct(product)
    // console.log(newProduct)

    return res.status(newProduct.code).json({
      message: newProduct.message,
      data: newProduct.data,
    })
  } catch (error) {
    console.log('Error desde products Router post(/):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export const updateOneProduct = async (req, res) => {
  const { pid } = req.params
  const newProperties = req.body
  try {
    const updatedProduct = await productManager.updateProduct(
      pid,
      newProperties
    )
    console.log(updatedProduct)
    // if (!updatedProduct || isNaN(pid) || +pid === 0) {
    //   return res.status(400).send({
    //     error:
    //       !isNaN(pid) || +pid === 0
    //         ? `Not enough products found`
    //         : `'${pid}' --> Invalid Data`,
    //   })
    // }
    return res.status(updatedProduct.code).send({
      message: updatedProduct.message,
      data: updatedProduct.data,
    })
  } catch (error) {
    console.error('Error desde products Router put(/:pid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export const deleteOneProduct = async (req, res) => {
  const { pid } = req.params
  try {
    const deletedProduct = await productManager.deleteProduct(pid)
    // if (!deletedProduct || isNaN(pid) || +pid === 0) {
    //   return res.status(400).send({
    //     error:
    //       !isNaN(pid) || +pid === 0
    //         ? `Not enough products found`
    //         : `'${pid}' --> Invalid Data`,
    //   })
    // }
    return res.status(deletedProduct.code).send({
      message: deletedProduct.message,
      data: deletedProduct.data,
    })
  } catch (error) {
    console.error('Error desde products Router delete(/:pid):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}
