import type {MetadataRoute} from 'next';import {siteUrl} from '@/lib/seo';
export default function robots():MetadataRoute.Robots{return {rules:[{userAgent:'*',allow:['/','/learn/','/blog/','/ne/'],disallow:['/api/','/profile','/leaderboard','/login','/signup','/verify-email','/reset-password','/forgot-password','/*?*']}],sitemap:`${siteUrl()}/sitemap.xml`,host:new URL(siteUrl()).host}}
