import MyRedis from './redis.js';

export default class RedisMiddleWare{
    constructor(){
       
        //console.log("")
    }
   
    apiMiddleware(req,res,next){
        let obj = new MyRedis()
        obj.isExist("jobs?brand="+req.params.brand).then((data)=>{
            if(data){
                obj.get("jobs?brand="+req.params.brand).then((data)=>{
                    console.log("served from cache")
                    res.json(JSON.parse(data))
                })
            } else {
                next()
            }
        })
        
    
    }
    jobMiddleware(req,res,next){
        let obj = new MyRedis();
        obj.isExist('jobs::job_id::', req.params.id).then((data)=>{
            if(data){
                obj.hGet('jobs::job_id::', req.params.id).then((data)=>{
                    console.log("served from cache")
                    res.json(JSON.parse(data))
                })
            } else {
                next()
            }
        })
       
    }
    allJobs(req, res, next){
        let obj = new MyRedis()
        obj.isExist("alljobs").then((data)=>{
            if(data){
                obj.get("alljobs").then((data)=>{
                    console.log("served from cache")
                   
                    res.json(JSON.parse(data))
                })   
                    
            }else{
                next()
            }
          
        })
        
            
    }


}