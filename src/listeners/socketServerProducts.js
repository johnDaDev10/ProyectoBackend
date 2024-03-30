import ProductManager from '../managers/ProductManager.js'
import { __dirname } from '../util/utils.js'

const productManager = new ProductManager(
  __dirname + '../../data/Products.json'
)

const socketServerProducts = (socketServer) => {
  socketServer.on('connection', async (socket) => {
    console.log('cliente conectado', socket.id)
    socket.on('disconnect', () => {
      console.log('Cliente desconectado', socket.id)
    })
    socket.on('addProduct', async (newProduct) => {
      const prod = await productManager.addProduct(newProduct)
      socketServer.emit('addProductTable', prod)
    })

    socket.on('deleteProduct', async (content) => {
      await productManager.deleteProduct(+content)
      const products = await productManager.getProducts()
      socketServer.emit('newArrProducts', products)
    })
  })
}

export default socketServerProducts
