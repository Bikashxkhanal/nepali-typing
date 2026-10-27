import {Schema,models,model} from 'mongoose';
const RateLimitSchema=new Schema({key:{type:String,required:true,unique:true},count:{type:Number,default:0},expiresAt:{type:Date,required:true,expires:0}},{timestamps:true});
export default models.RateLimit||model('RateLimit',RateLimitSchema);
