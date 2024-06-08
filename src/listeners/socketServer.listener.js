// import ProductManager from '../dao/managers/fileSystemManager/ProductManagerFS.js'
// import { __dirname } from '../util/utils.js'

// const productManager = new ProductManager(
//   __dirname + '../../data/Products.json'
// )

import ProductManager from '../dao/managers/MongoDBManager/ProductManagerMongo.js'
import MessageManager from '../dao/managers/MongoDBManager/MessageManagerMongo.js'

const productManager = new ProductManager()
const messageManager = new MessageManager()

const socketServerListener = (socketServer) => {
  socketServer.on('connection', async (socket) => {
    console.log('New client connected!', socket.id)

    socket.on('login', (user) => {
      console.log(user)
      socket.emit('welcome', user)
      socket.broadcast.emit('newUser', user)
    })

    try {
      const products = await productManager.getProducts()
      socket.emit('sendProducts', products.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }

    socket.on('disconnect', () => {
      console.log('Client Disconnected', socket.id)
    })

    socket.on('addProduct', async (newProduct) => {
      try {
        const product = await productManager.addProduct(newProduct)
        const products = await productManager.getProducts()
        socketServer.emit('sendProducts', products.data)
      } catch (error) {
        console.error('Error adding product:', error)
      }
    })

    socket.on('deleteProduct', async (pid) => {
      try {
        console.log(pid)
        await productManager.deleteProduct(pid)
        const products = await productManager.getProducts()
        socketServer.emit('sendProducts', products.data)
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    })

    socket.on('mensaje', async (info) => {
      try {
        await messageManager.createMessage(info)
        const messages = await messageManager.getMessages()
        socketServer.emit('chat', messages)
      } catch (error) {
        console.error('Error creating message:', error)
      }
    })

    socket.on('clearchat', async () => {
      try {
        await messageManager.deleteAllMessages()
        socketServer.emit('chat', [])
      } catch (error) {
        console.error('Error clearing chat:', error)
      }
    })
  })
}

export default socketServerListener
