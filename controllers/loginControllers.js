
const Users = require('../models/user')
const bcrypt = require('bcrypt')

const postLoginReq =  async (req,res)=>{
const { email, password } = req.body; // taking a form values from the body
const user = await Users.findOne({ email }).exec()
if (!user) {
    return res.redirect('/login')
}

const passwordMath = await bcrypt.compare(password, user.password)
if (!passwordMath) {
    return res.redirect('/login')
}

console.log(passwordMath);
console.log('password,user.password', password, "   ", user.password);
req.session.userName = user.username
req.session.isAuth = true;
res.redirect('/secret')

}
module.exports = {postLoginReq};