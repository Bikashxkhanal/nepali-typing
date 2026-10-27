import {SiteHeader} from '@/components/SiteHeader';import {ForgotPasswordForm} from '@/components/ForgotPasswordForm';export const metadata={title:'Reset your password',robots:{index:false,follow:false}};
export default function Forgot(){return <><SiteHeader/><main className="container-app auth-page"><ForgotPasswordForm/></main></>}
