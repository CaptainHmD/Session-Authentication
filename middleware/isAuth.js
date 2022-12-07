
const isAuth = (req, res, next) => {
    if (req.session.isAuth) return next()
    else res.send('you are not login')
}

module.exports = isAuth;