import mongoose from "mongoose";

export const CreateConnection=()=>{
     return mongoose.connect(process.env.DB_URL,{
        maxPoolSize:5
     });
}