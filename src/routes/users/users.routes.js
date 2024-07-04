import { Router } from 'express'
import { userRegister } from '../../dao/controllers/users.controller.js'

const usersRouter = Router()

usersRouter.post('/', userRegister)

export default usersRouter
