/** @type {import('next').NextConfig} */
const nextConfig={poweredByHeader:false,reactStrictMode:true,compress:true,skipTrailingSlashRedirect:true,experimental:{instrumentationHook:true},async headers(){return [
 {source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Strict-Transport-Security',value:'max-age=63072000; includeSubDomains; preload'}]},
 {source:'/_next/static/:path*',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},
 {source:'/icons/:path*',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]}
]}};
export default nextConfig;
