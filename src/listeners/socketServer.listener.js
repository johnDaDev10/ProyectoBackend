import ProductManager from '../managers/ProductManager.js'
import { __dirname } from '../util/utils.js'

const productManager = new ProductManager(
  __dirname + '../../data/Products.json'
)

const socketServerListener = (socketServer) => {
  socketServer.on('connection', async (socket) => {
    console.log('New client connected!', socket.id)
    socket.on('login', (user) => {
      socket.emit('welcome', user)
      socket.broadcast.emit('newUser', user)
    })

    const products = await productManager.getProducts()
    socketServer.emit('sendProducts', products)

    socket.on('disconnect', () => {
      console.log('Client Disconnected', socket.id)
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

export default socketServerListener
