import { json } from 'express';
import {Redis} from 'ioredis';
export default class  MyRedis{
    constructor(){
        this.redisObj = new Redis();
    }

    set(key, val){
        //console.log("key "+ key)
        //console.log("key "+ val)
        this.redisObj.set(key,JSON.stringify(val))
    }

    get(key){
        return this.redisObj.get(key)
    }
    isExist(key){
        
        return this.redisObj.exists(key)
    }
    flushall(){
        this.redisObj.flushall()
    }


}