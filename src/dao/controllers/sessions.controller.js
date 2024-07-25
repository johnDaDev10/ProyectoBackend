import { UserModel } from '../models/user.model.js'
import { hashPassword, isValidPassword } from '../../util/hashbcryp.js'
import jwt from 'jsonwebtoken'

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res
        .status(400)
        .render('login', { error: 'Wrong email or password' })
    }
    if (!isValidPassword(user, password)) {
      return res
        .status(400)
        .render('login', { error: 'Wrong email or password' })
    }
    const jwtUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
      role: user.role,
    }
    const token = jwt.sign({ user: jwtUser }, 'secretEcommerceJDLV', {
      expiresIn: '24h',
    })

    res.cookie('ecommerceCookieToken', token, {
      maxAge: 60 * 60 * 24 * 1000, //1 hora de vida
      httpOnly: true, //La cookie solo se puede acceder mediante HTTP
    })
    // req.session.user = sessionUser
    // req.session.save((err) => {
    //   if (err) console.log('session error => ', err)
    //   else res.status(200).redirect('/viewProducts')
    // })
  } catch (error) {
    console.log(error)
  }
}

// export const registerController = async (req, res, next) => {
//   try {
//     const { firstName, lastName, age, email, password } = req.body
//     if (!firstName || !lastName || !age || !email || !password) {
//       return res.status(400).json({ status: 'error', error: 'Missing Fields' })
//     }
//     const user = await UserModel.findOne({ email })
//     if (user) {
//       return res
//         .status(400)
//         .json({ status: 'error', error: 'User already exists' })
//     }
//     const newUser = {
//       ...req.body,
//       password: hashPassword(password),
//     }
//     const response = await UserModel.create(newUser)
//     const sessionUser = {
//       _id: response._id,
//       firstName: response.firstName,
//       lastName: response.lastName,
//       age: response.age,
//       email: response.email,
//     }
//     req.session.user = sessionUser
//     req.session.save((err) => {
//       if (err) console.log('session error => ', err)
//       else {
//         res.status(201).json({ status: 'success', payload: sessionUser })
//       }
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

export const logoutController = (req, res, next) => {
  res.clearCookie('ecommerceCookieToken')
  res.redirect('/')

  // req.session.destroy((err) => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     // res.clearCookie('start-solo')
  //     res.redirect('/')
  //   }
  // })
}
