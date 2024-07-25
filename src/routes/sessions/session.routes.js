import { Router } from 'express'
import {
  loginController,
  logoutController,
} from '../../dao/controllers/sessions.controller.js'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const sessionRouter = Router()

sessionRouter.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: '/api/sessions/failedLogin',
    session: false,
  }),
  async (req, res) => {
    // if (!req.user) {
    //   return res
    //     .status(400)
    //     .render('login', { error: 'Wrong email or password' })
    // }
    // console.log(req.user)
    const jwtUser = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email,
      cart: req.user.cart,
      role: req.user.role,
    }
    req.home = jwtUser

    const token = jwt.sign(jwtUser, 'secretEcommerceJDLV', {
      expiresIn: '24h',
    })

    res.cookie('ecommerceCookieToken', token, {
      maxAge: 60 * 60 * 24 * 1000, //1 hora de vida
      httpOnly: true, //La cookie solo se puede acceder mediante HTTP
    })
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
    session: false,
  }),
  async (req, res) => {
    try {
      const jwtUser = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        email: req.user.email,
        cart: req.user.cart,
        role: req.user.role,
      }
      req.home = jwtUser
      // console.log(jwtUser)
      const token = jwt.sign(jwtUser, 'secretEcommerceJDLV', {
        expiresIn: '24h',
      })

      res.cookie('ecommerceCookieToken', token, {
        maxAge: 60 * 60 * 24 * 1000, //1 hora de vida
        httpOnly: true, //La cookie solo se puede acceder mediante HTTP
      })
      return res.status(200).redirect('/viewProducts')
    } catch (error) {
      console.error('Error en githubcallback:', error)
    }
  }
)

sessionRouter.get('/logout', logoutController)

export default sessionRouter
