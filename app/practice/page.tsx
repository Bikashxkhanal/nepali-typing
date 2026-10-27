import type {Metadata} from 'next';import {SiteHeader} from '@/components/SiteHeader';import {IntermediatePractice} from '@/components/IntermediatePractice';
export const metadata:Metadata={title:'Nepali Typing Practice — Words and Sentences',description:'Practice Nepali words and sentences with live typing feedback.'};
export default function Practice(){return <><SiteHeader/><IntermediatePractice/></>}
