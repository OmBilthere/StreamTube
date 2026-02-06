// require('dotenv').config({path: './env'})

import dotenv from 'dotenv'
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: './env'
})

let port = process.env.PORT || 8000;



connectDB()

.then(()=>{

    app.listen(port , ()=>{

       console.log(`server is running on : ${port}`) 

    })

})
.catch((err)=>{
    console.log("MongoConnection failed" , err)
})




// another approach ( using iffe function )

//  import express from 'express'

// import mongoose from "mongoose";

// import {DB_NAME} from './constants'

// ;(async ()=>{
   
//   try {

//    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

//    app.on("error" , (error)=>{
//     console.log("ERROR :" , error);
//     throw error
//     });

//     app.listen(process.env.PORT , () =>{
//         console.log(`App is running on port ${process.env.PORT}`);

//    });


//   } catch (error) {

//      console.error("Error" , error)

//      throw error

//   }  

// }) ()

