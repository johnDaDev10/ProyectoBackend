export const sessionMiddleware = async (req, res, next) => {
  const user = await req.session.user
  if (user) {
    res.redirect('/viewProducts')
  } else {
    next()
  }
}
