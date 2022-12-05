require('dotenv').config()
const path = require('path')

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
    let user = await Users.findOne({username}).exec() // find the duplicates  values
    if(user){
        res.send('duplicates')
    }else{
        const result = await Users.create({
            "username":username,
            "password":password,
            "email":email,
        })
        res.send(result)

    }

})

mongoose.connection.once('open' , () =>{ // try to connect to DB before listing to the request
    console.log('Connected to MongoDB');
    app.listen(PORT,()=>{
        console.log(`server is running on http://localhost:${PORT}/`,);
    })

})
 