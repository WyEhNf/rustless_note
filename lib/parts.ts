import data from './parts.json';
import {chapters, posts, postHref, chapterNumber, type Post} from './posts';

export type Part={id:string;number:string;parent?:string;title:string;description:string;chapters:number[];html:string;toc:{id:string;title:string;depth:number}[];minutes:number};
export const parts:Part[]=data;
export const topParts=parts.filter(part=>!part.parent);
export const childrenOf=(part:Part)=>parts.filter(child=>child.parent===part.id);
export const parentOf=(part:Part)=>parts.find(parent=>parent.id===part.parent);
export const partHref=(part:Part)=>'/series/'+part.id;
export const partFor=(post:Post)=>parts.find(part=>part.chapters.includes(chapterNumber(post)))!;
export const partChapters=(part:Part)=>chapters.filter(chapter=>part.chapters.includes(chapter.number));
export const readingOrder=parts.flatMap(part=>[
 {title:part.title,href:partHref(part)},
 ...posts.filter(post=>part.chapters.includes(chapterNumber(post))).map(post=>({title:post.title,href:postHref(post)}))
]);
