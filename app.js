import express from 'express';
import mongodb from 'mongodb';
import child_process from 'child_process';
import  RedisMiddleWare  from './redismiddleware.js';
import MyRedis from './redis.js';
const app = express();
let db;
const redisObj = new MyRedis();
const redisMid = new RedisMiddleWare();
const p = child_process.fork('myfork.js')






app.use(express.json())
app.get("/",(req,res)=>{
    res.json("started")
})
app.get("/jobs",redisMid.allJobs,(req,res)=>{
    db.collection('jobs').find().toArray().then((data)=>{
     redisObj.set("alljobs", data)
     console.log("served from db")
      p.send(data);
      p.on('message',(dataP)=>{
        console.log(dataP)
      })
       res.json(data)
    })
})
app.get("/jobs/:brand",redisMid.apiMiddleware,(req,res)=>{
   // console.log(req.params.brand)
    db.collection('jobs').find({brand:req.params.brand}).toArray().then((data)=>{
        redisObj.set("jobs?brand="+req.params.brand, data)
        console.log("served from db")
        res.json(data)
     })
});
app.get("/jobs/jobid/:id",redisMid.jobMiddleware,(req,res)=>{
    db.collection('jobs').find({job_id:req.params.id}).toArray().then((data)=>{
        redisObj.hSet('jobs::job_id::',data[0])
        console.log('jobs::job_id::', req.params.id)
        console.log("served from db")
        res.json(data)
     })
})

app.post("/jobs/add",(req,res)=>{
    console.log("hi")
    db.collection('jobs').insertOne(req.body).then((data)=>{
        res.json("updated")
    })
});
app.listen(4100,()=>{
    console.log("server started")
    //console.log(mongodb)
    mongodb.MongoClient.connect('mongodb://localhost:27017/myjobs').then((client)=>{
        db = client.db();
       //redisMid = new RedisMiddleWare();
       //redisObj = new MyRedis();
       redisObj.flushAll()
    })
})