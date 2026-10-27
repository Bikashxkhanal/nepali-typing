import {SiteHeader} from '@/components/SiteHeader';import {ResetPasswordForm} from '@/components/ResetPasswordForm';export const metadata={title:'Choose a new password',robots:{index:false,follow:false}};
export default function Reset(){return <><SiteHeader/><main className="container-app auth-page"><ResetPasswordForm/></main></>}
