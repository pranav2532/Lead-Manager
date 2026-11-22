import express from "express";
import db from "./db.js";
import connect_db from "./db.js";
import auth from './Routes/Auth_Routes.js';
import leadRote from "./Routes/Lead_Routes.js";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import cors from "cors";

const app = express();

connect_db();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.get("/" , async(req , res)=>{
    try{
        res.status(200).send("home Page");
    }
    catch(err){
        res.status(501).json({error:"Internal Server Error"});
        console.log(err);
    }
});

app.use('/' , auth);
app.use('/' , leadRote);

const PORT = 4000;
app.listen(PORT , ()=>{
    console.log(`Server is live: ${PORT}`);
})

//  mongodb://127.0.0.1:27017/?