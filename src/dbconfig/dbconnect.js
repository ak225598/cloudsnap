import mongoose from "mongoose";

export async function connect(){
    try{
        const connectionInstance = await mongoose.connect(process.env.DB_CONNECTION_URL)
        console.log(`connection done: ${connectionInstance.connection.host}`)
        const connection = mongoose.connection

        connection.on('connected',()=>{
            console.log("MongoDb connected successfully")
        })

        connection.on('error',(e)=>{
            console.log("something is wrong with db connection:",e)
            process.exit()
        })

    }
    catch(e){
        console.log("something went wrong :",e);
    }
}