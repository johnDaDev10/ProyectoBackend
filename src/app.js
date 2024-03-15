import ProductManager from './managers/ProductManager.js'
import express from 'express'

const PORT = 8080

//Se creará una instancia de la clase “ProductManager”
const manager = new ProductManager('./src/data/Products.json')
const app = express()

app.get('/products', async (req, res) => {
  const products = await manager.getProducts()
  const { limit } = req.query
  console.log(+limit)
  if (!limit) {
    return res.status(200).send({
      message: `All produdcts found`,
      data: products,
    })
  }
  if (+limit > products.length || isNaN(limit) || +limit === 0) {
    return res.status(200).send({
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
})

app.get('/products/:pid', async (req, res) => {
  const products = await manager.getProducts()
  const { pid } = req.params
  console.log(pid)
  const product = await manager.getProductById(+pid)
  if (!product) {
    return res.status(200).send({
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
})

app.listen(PORT, () => {
  console.log(`Listening on PORT => ${PORT}`)
})
