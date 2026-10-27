import mongoose,{Schema,models,model} from 'mongoose';
const UserSchema=new Schema({name:{type:String,required:true},email:{type:String,required:true,unique:true,index:true},emailVerified:{type:Date,default:null},passwordHash:String,image:String,provider:{type:String,default:'credentials'},preferredLayout:{type:String,default:'traditional'}},{timestamps:true});
export default (models.User||model('User',UserSchema));
