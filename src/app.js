import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import apiRoutes from './routes/app.routes.js'
import { __dirname } from './util/utils.js'
import socketServerListener from './listeners/socketServer.listener.js'
import './config/dbConfig.js'

const PORT = 8080

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '../../public'))

// Configuracion Express Handlebars
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '../../views')

// Rutas
app.use('/api', apiRoutes)
app.use('/', apiRoutes)

const httpServer = app.listen(PORT, () => {
  try {
    console.log(`Listening on port ${PORT}\nAcceder a:`)
    console.log(`\t1). http://localhost:${PORT}/api/products`)
    console.log(`\t2). http://localhost:${PORT}/api/carts/:cid`)
    console.log(`\t3) - Render Home Products. http://localhost:${PORT}/`)
    console.log(
      `\t4) - Render Real Time Products. http://localhost:${PORT}/realTimeProducts`
    )
    console.log(
      `\t5) - Render Real Time Chat. http://localhost:${PORT}/chat
                Se guarda en localStorage un username: 'usuario ingresado' se borra si esta 1 minuto inactivo. 
                Si se le borra o lo elimina le pedirá nuevamente un usuario`
    )
    console.log(
      `\t6) - Render Products con Paginación. http://localhost:${PORT}/viewProducts
                Si le da clic a algún producto le mostrará el producto con mas información `
    )
    console.log(
      `\t7) - Render Cart con id. http://localhost:${PORT}/viewCart/:cid
                En /:cid ingrese _id de la cart. `
    )
  } catch (error) {
    console.log(`Error from app.js ${error}`)
  }
})

const socketServer = new Server(httpServer)

socketServerListener(socketServer)
