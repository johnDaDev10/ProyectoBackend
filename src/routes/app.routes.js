import { Router } from 'express'
import productsRouter from './products/products.routes.js'
import cartsRouter from './carts/carts.routes.js'
import viewsRouter from './views/views.routes.js'

const router = Router()

router.use('/products', productsRouter)
router.use('/carts', cartsRouter)
router.use('/', viewsRouter)

export default router
