const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () =>{
    try { //* try to connect with DB

        await mongoose.connect(process.env.DB_URL,{
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        
    } catch (error) {
        console.log(error);
        // console.log("error");
    }

}

module.exports = connectDB;










