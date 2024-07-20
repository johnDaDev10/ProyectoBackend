import { Router } from 'express'
import { userRegister } from '../../dao/controllers/users.controller.js'
import passport from 'passport'
const usersRouter = Router()

usersRouter.post(
  '/',
  passport.authenticate('register', {
    failureRedirect: '/api/users/failedRegister',
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).render('register', {
        error: 'Email is already registered',
      })
    }
    const sessionUser = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    }
    req.session.user = sessionUser

    return res.redirect('/viewProducts')
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
