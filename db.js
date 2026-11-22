import mongoose from "mongoose";

const connect_db = async()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/lead_manager");
        console.log("Connection Established");
    }
    catch(err){
        console.log(err);
    }
}

export default connect_db;