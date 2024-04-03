import ProductManager from '../managers/ProductManager.js'
import { __dirname } from '../util/utils.js'

const productManager = new ProductManager(
  __dirname + '../../data/Products.json'
)

const socketServerProducts = (socketServer) => {
  socketServer.on('connection', async (socket) => {
    console.log('cliente conectado', socket.id)

    const products = await productManager.getProducts()
    socketServer.emit('sendProducts', products)

    socket.on('disconnect', () => {
      console.log('Cliente desconectado', socket.id)
    })

    socket.on('addProduct', async (newProduct) => {
      const product = await productManager.addProduct(newProduct)
      const products = await productManager.getProducts()
      socketServer.emit('sendProducts', products)
    })

    socket.on('deleteProduct', async (pid) => {
      await productManager.deleteProduct(+pid)
      const products = await productManager.getProducts()
      socketServer.emit('sendProducts', products)
    })
  })
}

export default socketServerProducts
