const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const routerPath = require('./Routes/routes');
require('dotenv').config();
const PORT_NO = process.env.PORT_NO;
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', routerPath);

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected successfully!!!");
    }
    catch(error){
        console.log(error);
    }
}
connectDb();

app.listen(PORT_NO, () => {
    console.log(`server is running on the port no : ${PORT_NO}`);
    // console.log(bcrypt.hashSync('admin123', 12));
})