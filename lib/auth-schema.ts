import {z} from 'zod';
export const SignupSchema=z.object({name:z.string().trim().min(2,'Enter your name').max(80),email:z.string().trim().email('Enter a valid email').max(254).transform(v=>v.toLowerCase()),password:z.string().min(8,'Use at least 8 characters').max(128),terms:z.literal(true,{errorMap:()=>({message:'Accept the Terms and Privacy Policy'})}),callbackUrl:z.string().optional().refine(v=>!v||(v.startsWith('/')&&!v.startsWith('//')),'Invalid callback URL')});
export const LoginSchema=z.object({email:z.string().trim().email().max(254).transform(v=>v.toLowerCase()),password:z.string().min(1).max(128)});
export const EmailSchema=z.object({email:z.string().trim().email().max(254).transform(v=>v.toLowerCase())});
export const PasswordSchema=z.string().min(8,'Use at least 8 characters').max(128);
