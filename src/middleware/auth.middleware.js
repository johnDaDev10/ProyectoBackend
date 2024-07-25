import jwt from 'jsonwebtoken'

export const auth = async (req, res, next) => {
  const token = req.cookies['ecommerceCookieToken']

  if (!token) {
    return res.redirect('/')
  }
  jwt.verify(token, 'secretEcommerceJDLV', (err, user) => {
    if (err) {
      res.clearCookie('ecommerceCookieToken')
      return res.redirect('/error404', {
        error: 'You are not authorized on this page',
      })
    }

    next()
  })
}
