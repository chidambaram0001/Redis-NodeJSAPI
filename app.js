import express from 'express';
import mongodb from 'mongodb';
import MyRedis from './redis.js'
const app = express();
let db;
var redisObj;

function apiMiddleware(req,res,next){
    redisObj.isExist("jobs?brand="+req.params.brand).then((data)=>{
        if(data){
            redisObj.get("jobs?brand="+req.params.brand).then((data)=>{
                console.log("served from cache")
                res.json(JSON.parse(data))
            })
        } else {
            next()
        }
    })
    

}

function allJobs(req, res, next){
    redisObj.isExist("alljobs").then((data)=>{
        if(data){
            redisObj.get("alljobs").then((data)=>{
                console.log("served from cache")
                res.json(JSON.parse(data))
            })   
                
        }else{
            next()
        }
      
    })
    
        
}


app.use(express.json())
app.get("/",(req,res)=>{
    res.json("started")
})
app.get("/jobs",allJobs,(req,res)=>{
    db.collection('jobs').find().toArray().then((data)=>{
     redisObj.set("alljobs", data)
     console.log("served from db")
       res.json(data)
    })
})
app.get("/jobs/:brand",apiMiddleware,(req,res)=>{
   // console.log(req.params.brand)
    db.collection('jobs').find({brand:req.params.brand}).toArray().then((data)=>{
        redisObj.set("jobs?brand="+req.params.brand, data)
        console.log("served from db")
        res.json(data)
     })
})
app.listen(4100,()=>{
    console.log("server started")
    //console.log(mongodb)
    mongodb.MongoClient.connect('mongodb://localhost:27017/myjobs').then((client)=>{
        db = client.db();
        redisObj = new MyRedis();
        redisObj.flushall();
       
    })
})