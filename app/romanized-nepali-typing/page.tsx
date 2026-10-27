import {buildMetadata} from '@/lib/seo';import {getSeoPage} from '@/lib/seo-pages';import {SeoLanding} from '@/components/SeoLanding';
export function generateMetadata(){const p=getSeoPage('romanized-nepali-typing')!;return buildMetadata({title:p.title,description:p.description,path:'/romanized-nepali-typing'})}export default function Page(){return <SeoLanding slug="romanized-nepali-typing"/>}
