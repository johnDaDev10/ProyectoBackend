import { Router } from 'express'
import {
  loginController,
  logoutController,
} from '../../dao/controllers/sessions.controller.js'
import passport from 'passport'

const sessionRouter = Router()

sessionRouter.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: '/api/sessions/failedLogin',
  }),
  async (req, res) => {
    // if (!req.user) {
    //   return res
    //     .status(400)
    //     .render('login', { error: 'Wrong email or password' })
    // }
    const sessionUser = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    }
    req.session.user = sessionUser
    return res.status(200).redirect('/viewProducts')
  }
)

sessionRouter.get('/failedLogin', async (req, res) => {
  try {
    return res.status(400).render('login', { error: 'Wrong email or password' })
  } catch (error) {
    console.log(error)
  }
})

sessionRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async (req, res) => {}
)

sessionRouter.get(
  '/githubcallback',
  passport.authenticate('github', {
    failureRedirect: '/api/sessions/failedLogin',
  }),
  async (req, res) => {
    try {
      req.session.user = req.user

      return res.status(200).redirect('/viewProducts')
    } catch (error) {
      console.error('Error en githubcallback:', error)
    }
  }
)

sessionRouter.get('/logout', logoutController)

export default sessionRouter
