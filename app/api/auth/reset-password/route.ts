import {NextRequest,NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
import {PasswordSchema} from '@/lib/auth-schema';
import {connectDB} from '@/lib/db';
import {hashToken,rateLimit,requestIp,sameOrigin} from '@/lib/auth-security';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';

const Body=z.object({token:z.string().min(32).max(200),password:PasswordSchema});
export async function POST(request:NextRequest){
 if(!sameOrigin(request))return NextResponse.json({error:'Request rejected'},{status:403});
 const parsed=Body.safeParse(await request.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({error:'Invalid or expired reset link.'},{status:400});
 try{
  if(!(await rateLimit(`reset-submit:${requestIp(request)}`,8)))return NextResponse.json({error:'Too many attempts. Try later.'},{status:429});
  await connectDB();
  const record=await PasswordResetToken.findOne({tokenHash:hashToken(parsed.data.token),expiresAt:{$gt:new Date()}});
  if(!record)return NextResponse.json({error:'Invalid or expired reset link.'},{status:400});
  await User.updateOne({_id:record.userId},{$set:{passwordHash:await bcrypt.hash(parsed.data.password,12)}});
  await PasswordResetToken.deleteMany({userId:record.userId});
  return NextResponse.json({ok:true});
 }catch(error){
  console.error('[auth/reset]',error instanceof Error?error.message:'request failed');
  return NextResponse.json({error:'Could not reset password. Try again.'},{status:500});
 }
}
