export const sessionMiddleware = async (req, res, next) => {
  if (req.cookies['ecommerceCookieToken']) {
    res.redirect('/viewProducts')
  } else {
    next()
  }
}
