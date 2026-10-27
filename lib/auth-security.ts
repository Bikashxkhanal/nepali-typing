import {createHash,randomBytes} from 'node:crypto';
import type {NextRequest} from 'next/server';
import {connectDB} from './db';
import RateLimit from '@/models/RateLimit';

export function requestIp(request:{headers:Headers}){return (request.headers.get('x-forwarded-for')||request.headers.get('x-real-ip')||'unknown').split(',')[0].trim().slice(0,80)}
export function sameOrigin(request:NextRequest){const origin=request.headers.get('origin');if(!origin)return false;try{return new URL(origin).host===request.nextUrl.host}catch{return false}}
export function hashToken(token:string){return createHash('sha256').update(token).digest('hex')}
export function newToken(){return randomBytes(32).toString('base64url')}
export async function rateLimit(key:string,limit:number,windowMs=15*60_000){await connectDB();const bucket=Math.floor(Date.now()/windowMs);const id=`${key}:${bucket}`;try{const result=await RateLimit.findOneAndUpdate({key:id},{$inc:{count:1},$setOnInsert:{expiresAt:new Date((bucket+1)*windowMs)}},{upsert:true,new:true,setDefaultsOnInsert:true});return (result?.count||0)<=limit}catch(error){if((error as {code?:number}).code===11000){const result=await RateLimit.findOneAndUpdate({key:id},{$inc:{count:1}},{new:true});return (result?.count||0)<=limit}throw error}}
export async function sendMail(to:string,subject:string,html:string){if(!process.env.RESEND_API_KEY||!process.env.EMAIL_FROM)throw new Error('Email delivery is not configured');const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.EMAIL_FROM,to,subject,html})});if(!response.ok)throw new Error(`Email delivery failed (${response.status})`)}
export function siteUrl(){return (process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000').replace(/\/$/,'')}
