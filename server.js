require('dotenv').config()
const path = require('path')
const bcrypt = require('bcrypt');
//express imports
const express = require('express');
const app = express();

//session imports 
const session = require('express-session')

//mongodb imports
const MongoDBSession = require('connect-mongodb-session')(session)
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnect')
//model
const Users = require('./models/user')


const PORT = process.env.PORT || 4000;
// middleware 

// built in middleware to handle urlencoded from data
app.use(express.urlencoded({ extended: true }))

// built in middleware for json
app.use(express.json());

connectDB(); // connect to the db

const store = new MongoDBSession({ // create collections in mongodb and name it mySessions
    uri: process.env.DB_URL,
    collection:'mySessions'
})

//middleware for session 
const oneDay = 1000 * 60 * 60 * 24; // one day
app.use(session({ 
    secret : process.env.SECRET, //* docs line 3
    resave: false,//* docs line 10
    saveUninitialized: true,//* docs line 18
    cookie:{maxAge: oneDay},//* docs line 23
    store:store

})) // these stands for all req.session

app.get('/',(req,res)=>{ // root
    console.log(req.session.id); // this match id in the cookie
    res.send(req.session);
})
app.get('/login',(req,res)=>{
    res.render(path.join('login.ejs'))
})
app.get('/register',(req,res)=>{
    res.render(path.join('register.ejs'))
})

//! in post request we can store authentication process
app.post('/register', async (req,res)=>{
    const {username,email,password} = req.body; // taking a register values from the body
    let userName = await Users.findOne({username}).exec() // find the duplicates  values
    let userEmailDup = await Users.findOne({email}).exec() // find the duplicates  values
    if(userName||userEmailDup){
        // res.send('duplicates')
        return res.redirect('/register') // or maybe another register page with alert page 
    }

    // if the unique values are unique create new user and store it in DB
    //TODO: hashing the password via bcrypt https://www.npmjs.com/package/bcrypt
    const hashPassword = await bcrypt.hash(password,10) // hashing the password
    userName = new Users({
        username,
        email,
        password: hashPassword
    })
        // const result = await Users.create(user)
        userName.save();
        //  res.send(user);
         res.redirect('/login');
    

})

app.post('/login', async (req, res) => {
    const { email, password } = req.body; // taking a form values from the body
    const user = await Users.findOne({ email }).exec()
    if (!user) {
    return res.redirect('/login')
    }

    const passwordMath = await bcrypt.compare(password,user.password)
    console.log(passwordMath);
    console.log('password,user.password',password,"   ",user.password);
})


mongoose.connection.once('open' , () =>{ // try to connect to DB before listing to the request
    console.log('Connected to MongoDB');
    app.listen(PORT,()=>{
        console.log(`server is running on http://localhost:${PORT}/`,);
    })

})
 