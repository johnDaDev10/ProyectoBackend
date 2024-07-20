import { Router } from 'express'
import productsRouter from './products/products.routes.js'
import cartsRouter from './carts/carts.routes.js'
import viewsRouter from './views/views.routes.js'
import usersRouter from './users/users.routes.js'
import sessionRouter from './sessions/session.routes.js'

const router = Router()

router.use('/', viewsRouter)
router.use('/products', productsRouter)
router.use('/carts', cartsRouter)
router.use('/sessions', sessionRouter)
router.use('/users', usersRouter)
router.use('*', async (req, res) => {
  return res.status(404).render('error404')
})

export default router
