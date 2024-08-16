import { json } from 'express';
import {Redis} from 'ioredis';
export default class  MyRedis{
    constructor(){
        this.redis = new Redis();
    }

    set(key, val){
        //console.log("key "+ key)
        //console.log("key "+ val)
        this.redis.set(key,JSON.stringify(val))
    }

    hSet(key,val){
       let valObj = {};
       valObj[val.job_id] = JSON.stringify(val)
        this.redis.hset(key,valObj)
    }

    async hGet(key,val){
      return this.redis.hget(key,val)
    }

    get(key){
        return this.redis.get(key)
    }
    isExist(key){
        
        return this.redis.exists(key)
    }
    flushAll(){
        this.redis.flushall()
    }


}