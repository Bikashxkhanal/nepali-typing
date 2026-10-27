import {buildMetadata} from '@/lib/seo';import {getSeoPage} from '@/lib/seo-pages';import {SeoLanding} from '@/components/SeoLanding';
export function generateMetadata(){const p=getSeoPage('preeti-typing')!;return buildMetadata({title:p.title,description:p.description,path:'/preeti-typing'})}export default function Page(){return <SeoLanding slug="preeti-typing"/>}
