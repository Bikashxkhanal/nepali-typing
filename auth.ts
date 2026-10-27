import NextAuth from 'next-auth';
import type {Provider} from 'next-auth/providers';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Facebook from 'next-auth/providers/facebook';
import Credentials from 'next-auth/providers/credentials';
import {MongoDBAdapter} from '@auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import {LoginSchema} from '@/lib/auth-schema';
import {connectDB} from '@/lib/db';
import {mongoClient} from '@/lib/mongo-client';
import {rateLimit,requestIp} from '@/lib/auth-security';
import User from '@/models/User';

const providers:Provider[]=[];
if(process.env.AUTH_GOOGLE_ID&&process.env.AUTH_GOOGLE_SECRET)providers.push(Google({clientId:process.env.AUTH_GOOGLE_ID,clientSecret:process.env.AUTH_GOOGLE_SECRET,allowDangerousEmailAccountLinking:true}));
if(process.env.AUTH_GITHUB_ID&&process.env.AUTH_GITHUB_SECRET)providers.push(GitHub({clientId:process.env.AUTH_GITHUB_ID,clientSecret:process.env.AUTH_GITHUB_SECRET,allowDangerousEmailAccountLinking:true,authorization:{params:{scope:'read:user user:email'}}}));
if(process.env.AUTH_FACEBOOK_ID&&process.env.AUTH_FACEBOOK_SECRET)providers.push(Facebook({clientId:process.env.AUTH_FACEBOOK_ID,clientSecret:process.env.AUTH_FACEBOOK_SECRET,allowDangerousEmailAccountLinking:true,authorization:{params:{scope:'email,public_profile'}}}));
providers.push(Credentials({name:'Email and password',credentials:{email:{label:'Email',type:'email'},password:{label:'Password',type:'password'},remember:{label:'Remember me',type:'text'}},async authorize(raw,request){const parsed=LoginSchema.safeParse(raw);if(!parsed.success)return null;try{if(!(await rateLimit(`login:${requestIp(request)}:${parsed.data.email}`,12)))return null;await connectDB();const user=await User.findOne({email:parsed.data.email}).select('+passwordHash');if(!user?.passwordHash||!(await bcrypt.compare(parsed.data.password,user.passwordHash)))return null;return {id:user._id.toString(),name:user.name,email:user.email,emailVerified:user.emailVerified,provider:'credentials',rememberMe:raw.remember==='true'}}catch{return null}}}));

async function verifiedProviderEmail(provider:string,email:string|undefined,profile:Record<string,unknown>|undefined,accessToken:string|undefined){
 if(provider==='google')return profile?.email_verified===true&&email?email:false;
 if(provider==='github'&&accessToken){try{const response=await fetch('https://api.github.com/user/emails',{headers:{Authorization:`Bearer ${accessToken}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});if(!response.ok)return false;const emails=await response.json() as {email:string;verified:boolean;primary:boolean}[];const match=emails.find(x=>x.verified&&x.email.toLowerCase()===(email||'').toLowerCase())||(!email?emails.find(x=>x.verified&&x.primary):undefined);return match?.email||false}catch{return false}}
 if(provider==='facebook'&&accessToken){try{const response=await fetch(`https://graph.facebook.com/me?fields=email&access_token=${encodeURIComponent(accessToken)}`);if(!response.ok)return false;const result=await response.json() as {email?:string};return result.email&&(!email||result.email.toLowerCase()===email.toLowerCase())?result.email:false}catch{return false}}
 return false;
}

export const {handlers,auth,signIn,signOut}=NextAuth({
 adapter:MongoDBAdapter(mongoClient),
 providers,
 secret:process.env.AUTH_SECRET,
 trustHost:true,
 session:{strategy:'jwt',maxAge:30*24*60*60},
 pages:{signIn:'/login'},
 callbacks:{
  async signIn({user,account,profile}){if(!account||account.provider==='credentials')return true;const verifiedEmail=await verifiedProviderEmail(account.provider,user.email||undefined,profile as Record<string,unknown>|undefined,account.access_token);if(!verifiedEmail)return false;user.email=verifiedEmail;try{if(!(await rateLimit(`oauth:${account.provider}:${verifiedEmail.toLowerCase()}`,20)))return false}catch{return false}return true},
  async jwt({token,user}){if(user?.id){token.userId=user.id;token.rememberMe=user.rememberMe;if(user.rememberMe===false)token.exp=Math.floor(Date.now()/1000)+24*60*60}return token},
  async session({session,token}){if(session.user)session.user.id=String(token.userId||token.sub||'');return session},
 },
 events:{async linkAccount({user,account}){if(!user.email||!['google','github','facebook'].includes(account.provider))return;await connectDB();await User.updateOne({email:user.email.toLowerCase()},{$set:{emailVerified:new Date(),provider:account.provider}})}},
});
