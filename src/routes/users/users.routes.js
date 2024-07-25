import { Router } from 'express'
// import { userRegister } from '../../dao/controllers/users.controller.js'
import jwt from 'jsonwebtoken'
import passport from 'passport'

const usersRouter = Router()

usersRouter.post(
  '/',
  passport.authenticate('register', {
    failureRedirect: '/api/users/failedRegister',
    session: false,
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(400).render('register', {
          error: 'Email is already registered',
        })
      }
      const jwtUser = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role,
      }

      const token = jwt.sign(jwtUser, 'secretEcommerceJDLV', {
        expiresIn: '24h',
      })

      res.cookie('ecommerceCookieToken', token, {
        maxAge: 60 * 60 * 24 * 1000, //1 hora de vida
        httpOnly: true, //La cookie solo se puede acceder mediante HTTP
      })

      // req.session.user = jwtUser

      return res.redirect('/viewProducts')
    } catch (error) {
      console.log(`error desde users.routes ${error}`)
    }
  }
)

usersRouter.get('/failedRegister', async (req, res) => {
  try {
    return res
      .status(400)
      .render('register', { error: 'Email is already registered' })
  } catch (error) {
    console.log(error)
  }
})

export default usersRouter
