import {SiteHeader} from '@/components/SiteHeader';import {VerificationPanel} from '@/components/VerificationPanel';export const metadata={title:'Verify your email',robots:{index:false,follow:false}};
export default function Verify(){return <><SiteHeader/><main className="container-app auth-page"><VerificationPanel/></main></>}
