import { Router } from 'express'
import productsRouter from './products/products.routes.js'
import cartsRouter from './carts/carts.routes.js'

const router = Router()

router.use('/products', productsRouter)
router.use('/carts', cartsRouter)

export default router
