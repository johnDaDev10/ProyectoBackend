import passport from 'passport'
import jwt from 'passport-jwt'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import { UserModel } from '../dao/models/user.model.js'
import { CartModel } from '../dao/models/cart.model.js'
import { hashPassword, isValidPassword } from '../util/hashbcryp.js'

const LocalStrategy = local.Strategy

const JwtStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const initializePassport = () => {
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'secretEcommerceJDLV',
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username })
          // console.log(user)
          if (!user) {
            return done(null, false)
          }

          if (!isValidPassword(user, password)) {
            return done(null, false)
          }

          const jwtUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email,
            cart: user.cart,
            role: user.role,
          }
          // console.log(jwtUser)
          return done(null, jwtUser)
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
          const newCart = await CartModel.create({})
          // console.log(newCart)
          const newUser = {
            firstName,
            lastName,
            email: username,
            age,
            cart: newCart._id,
            password: hashPassword(password),
            role,
          }
          // console.log(newUser)
          const userDB = await UserModel.create(newUser)
          // console.log(userDB)
          const jwtUser = {
            _id: userDB._id,
            firstName: userDB.firstName,
            lastName: userDB.lastName,
            age: userDB.age,
            email: userDB.email,
            cart: userDB.cart,
            role: userDB.role,
          }
          return done(null, jwtUser)
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
        // console.log('Profile:', profile)

        try {
          const user = await UserModel.findOne({
            email: profile._json.email,
          })

          if (!user) {
            const role =
              profile._json.email === 'admincoder@coder.com' ? 'admin' : 'user'

            const newCart = await CartModel.create({})

            const newUser = {
              firstName: profile._json.name || profile._json.login,
              lastName: 'GitHub',
              email: profile._json.email,
              password: hashPassword('github'),
              age: 0,
              cart: newCart._id,
              role,
            }

            // console.log(newUser)
            const userDB = await UserModel.create(newUser)
            const jwtUser = {
              _id: userDB._id,
              firstName: userDB.firstName,
              lastName: userDB.lastName,
              age: userDB.age,
              email: userDB.email,
              cart: userDB.cart,
              role: userDB.role,
            }
            return done(null, jwtUser)
          } else {
            // console.log(user)
            done(null, user)
          }
        } catch (error) {
          return done(error)
        }
      }
    )
  )
}

export const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) {
    token = req.cookies['ecommerceCookieToken']
  }
  return token
}

export default initializePassport
