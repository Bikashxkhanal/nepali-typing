'use client';
import {signIn} from 'next-auth/react';
export function OAuthButtons({providers,callbackUrl='/learn'}:{providers:string[];callbackUrl?:string}){return <div className="oauth-stack">{providers.filter(x=>x!=='credentials').map(provider=><button type="button" className="oauth-button" key={provider} onClick={()=>signIn(provider,{callbackUrl})}><span className={`oauth-mark oauth-${provider}`} aria-hidden="true">{provider==='google'?'G':provider==='github'?'●':'f'}</span>Continue with {provider[0].toUpperCase()+provider.slice(1)}</button>)}</div>}
