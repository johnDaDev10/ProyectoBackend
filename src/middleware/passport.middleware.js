import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'

import { UserModel } from '../dao/models/user.model.js'
import { hashPassword, isValidPassword } from '../util/hashbcryp.js'

const LocalStrategy = local.Strategy

export const initializePassport = () => {
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username })

          if (!user) {
            return done(null, false)
          }

          if (!isValidPassword(user, password)) {
            return done(null, false)
          }

          const sessionUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email,
            role: user.role,
          }

          return done(null, sessionUser)
        } catch (error) {
          return done(error)
        }
      }
    )
  )
  passport.use(
    'register',
    new LocalStrategy(
      {
        //Le digo que quiero acceder al objeto request
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        const { firstName, lastName, age } = req.body

        try {
          const user = await UserModel.findOne({ email: username })

          if (user) {
            return done(null, false)
          }

          const role =
            username === 'admincoder@coder.com' && password === 'adminCod3r123'
              ? 'admin'
              : 'user'

          const newUser = {
            firstName,
            lastName,
            email: username,
            password: hashPassword(password),
            age,
            role,
          }
          console.log(newUser)
          const userDB = await UserModel.create(newUser)
          console.log(userDB)
          const sessionUser = {
            _id: userDB._id,
            firstName: userDB.firstName,
            lastName: userDB.lastName,
            age: userDB.age,
            email: userDB.email,
            role: userDB.role,
          }
          return done(null, sessionUser)
        } catch (error) {
          return done(error)
        }
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById({ _id: id })
    done(null, user)
  })

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv23limrdQZfOPjKLHFN',
        clientSecret: '478cff29127f2b2a5e1f3157d3032822e8f0d0b7',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('Profile:', profile)

        try {
          const user = await UserModel.findOne({
            email: profile._json.email,
          })

          if (!user) {
            const role =
              profile._json.email === 'admincoder@coder.com' ? 'admin' : 'user'
            const newUser = {
              firstName: profile._json.name || profile._json.login,
              lastName: 'GitHub',
              email: profile._json.email,
              password: 'github',
              age: 0,
              role,
            }
            console.log(newUser)
            const userDB = await UserModel.create(newUser)
            const sessionUser = {
              _id: userDB._id,
              firstName: userDB.firstName,
              lastName: userDB.lastName,
              age: userDB.age,
              email: userDB.email,
              role: userDB.role,
            }
            return done(null, sessionUser)
          } else {
            done(null, user)
          }
        } catch (error) {
          return done(error)
        }
      }
    )
  )
}
