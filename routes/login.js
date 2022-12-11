const express = require('express')
const router = express.Router()
const path = require('path')
const root = path.join(__dirname, '..')
const loginControllers = require('../controllers/loginControllers')
router.get('/',(req,res)=>{
    res.render(path.join(__dirname,'..','public','views','login.ejs'),{root:root})
})


router.post('/',loginControllers.postLoginReq)

module.exports = router;
