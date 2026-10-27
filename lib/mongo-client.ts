import {MongoClient} from 'mongodb';
const uri=process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/nepali_typing';
const globalMongo=globalThis as typeof globalThis&{__authMongoClient?:MongoClient};
export const mongoClient=globalMongo.__authMongoClient??new MongoClient(uri);
if(process.env.NODE_ENV!=='production')globalMongo.__authMongoClient=mongoClient;
