import { Router } from 'express'
import {
  loginController,
  logoutController,
} from '../../dao/controllers/sessions.controller.js'

const sessionRouter = Router()

sessionRouter.post('/login', loginController)

// sessionRouter.post('/register', registerController)

sessionRouter.get('/logout', logoutController)

export default sessionRouter
