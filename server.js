require('dotenv').config()
const express = require('express');
const app = express();
const session = require('express-session')

const mongoose = require('mongoose')
const PORT = process.env.PORT || 4000;

//middleware for session 
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret : process.env.SECRET, //* docs line 3
    resave: false,//* docs line 10
    saveUninitialized: true,//* docs line 18
    cookie:{maxAge: oneDay}//* docs line 23
})) // these stands for all req.session

app.get('/',(req,res)=>{ // root
    console.log(req.session.id); // this match id in the cookie
    res.send(req.session);
})


app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}/`,);
})