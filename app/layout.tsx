import type {Metadata} from 'next';
import './globals.css';
import {AppProviders} from '@/components/AppProviders';
import {siteUrl} from '@/lib/seo';
import {SiteFooter} from '@/components/SiteFooter';
import Script from 'next/script';import {WebVitalsReporter} from '@/components/WebVitalsReporter';
import localFont from 'next/font/local';
const notoSansDevanagari=localFont({src:[{path:'../public/fonts/NotoSansDevanagari-Regular.ttf',weight:'400',style:'normal'},{path:'../public/fonts/NotoSansDevanagari-Bold.ttf',weight:'700',style:'normal'}],display:'swap',preload:true,variable:'--font-noto'});

export const metadata:Metadata={metadataBase:new URL(siteUrl()),title:{default:'Nepali typing practice and tests | NepaliTyping',template:'%s | NepaliTyping'},description:'Practice Nepali typing online with lessons, Preeti and Unicode tools, sentence drills and timed speed tests.',verification:{google:process.env.GOOGLE_SITE_VERIFICATION,other:{'msvalidate.01':process.env.BING_SITE_VERIFICATION||''}},applicationName:'NepaliTyping',manifest:'/manifest.webmanifest'};
export default function RootLayout({children}:{children:React.ReactNode}){const analyticsDomain=process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;return <html lang="en" suppressHydrationWarning><body className={notoSansDevanagari.variable}><AppProviders>{children}<SiteFooter/><WebVitalsReporter/></AppProviders>{analyticsDomain&&<Script defer data-domain={analyticsDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive"/>}</body></html>}
