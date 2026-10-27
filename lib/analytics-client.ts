'use client';
declare global{interface Window{plausible?: (event:string,options?:{props?:Record<string,string|number>})=>void}}
export function trackEvent(event:string,props?:Record<string,string|number>){if(typeof window!=='undefined')window.plausible?.(event,{props})}
