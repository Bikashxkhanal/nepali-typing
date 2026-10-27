import {buildMetadata} from '@/lib/seo';import {getSeoPage} from '@/lib/seo-pages';import {SeoLanding} from '@/components/SeoLanding';
export function generateMetadata(){const p=getSeoPage('unicode-nepali-typing')!;return buildMetadata({title:p.title,description:p.description,path:'/unicode-nepali-typing'})}export default function Page(){return <SeoLanding slug="unicode-nepali-typing"/>}
