import {LessonPlayer} from '@/components/LessonPlayer';
export default function LessonPage({params}:{params:{lessonId:string}}){return <LessonPlayer lessonId={params.lessonId}/>}
