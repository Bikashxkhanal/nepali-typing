import {NextRequest,NextResponse} from 'next/server';

export function middleware(request:NextRequest){
 const url=request.nextUrl.clone();
 const aliases:Record<string,string>={'/preeti-typing-test':'/preeti-typing','/nepali-unicode-typing':'/unicode-nepali-typing','/practice':'/nepali-typing-practice','/test':'/nepali-typing-test'};
 const requestedPath=url.pathname.replace(/\/$/,'')||'/';const alias=aliases[requestedPath];if(alias)url.pathname=alias;
 const incomingHost=request.headers.get('host')?.split(':')[0].toLowerCase();
 if(incomingHost==='localhost'||incomingHost==='127.0.0.1')return alias?NextResponse.redirect(url,301):NextResponse.next();
 const configured=process.env.NEXT_PUBLIC_SITE_URL;if(!configured)return alias?NextResponse.redirect(url,301):NextResponse.next();
 const canonical=new URL(configured);const forwardedProto=request.headers.get('x-forwarded-proto')?.split(',')[0].trim()||url.protocol.replace(':','');
 const shouldRedirect=!!alias||(canonical.protocol==='https:'&&forwardedProto!=='https')||incomingHost!==canonical.hostname.toLowerCase()||(url.pathname.length>1&&url.pathname.endsWith('/'));
 if(!shouldRedirect)return NextResponse.next();url.protocol=canonical.protocol;url.host=canonical.host;if(url.pathname.length>1)url.pathname=url.pathname.replace(/\/+$/,'');return NextResponse.redirect(url,301)
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest).*)']};
