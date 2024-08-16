import MyRedis from './redis.js';
const redisObj = new MyRedis();
process.on('message',(data)=>{
    console.log(data.length);
    for(let i=0;i<data.length;i++){
        redisObj.hSet('jobs::job_id::', data[i])
    }
    console.log("data recived in fork")

    process.send("updated in redis")
})