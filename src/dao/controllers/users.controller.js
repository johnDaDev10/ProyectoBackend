import { UserModel } from '../models/user.model.js'
import { hashPassword } from '../../util/hashbcryp.js'

export const userRegister = async (req, res) => {
  const { firstName, lastName, age, email, password } = req.body
  try {
    console.log(firstName, lastName, email, password, age)
    // Verificar si el correo electrónico ya está registrado
    const existingUser = await UserModel.findOne({ email: email })
    if (existingUser) {
      return res.status(400).render('register', {
        error: 'Email is already registered',
      })
    }

    // Definir el rol del usuario
    const role =
      email === 'admincoder@coder.com' && password === 'adminCod3r123'
        ? 'admin'
        : 'user'

    console.log(role)
    // Crear un nuevo usuario
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashPassword(password),
      age,
      role,
    })

    req.session.user = { ...newUser._doc }
    console.log(req.session)
    res.redirect('/viewProducts')
  } catch (error) {
    console.log('Error desde Users Router post(/):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}
