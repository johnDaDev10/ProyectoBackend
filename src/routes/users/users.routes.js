import { Router } from 'express'
import { hashPassword } from '../../util/hashbcryp.js'
import { UserModel } from '../../dao/models/user.model.js'

const usersRouter = Router()

usersRouter.post('/', async (req, res) => {
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

    // // Almacenar información del usuario en la sesión (puedes ajustarlo según tus necesidades)
    req.session.login = true
    req.session.user = { ...newUser._doc }
    console.log(req.session)
    //res.status(200).send({ message: "Usuario creado con éxito" });
    res.redirect('/viewProducts')
  } catch (error) {
    console.log('Error desde Users Router post(/):', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    })
  }
})

export default usersRouter
