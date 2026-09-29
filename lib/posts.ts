import data from "./posts.json";
export type Post={id:string;title:string;chapter:string;section:string;description:string;overview?:boolean;sourceIds?:string[];legacyIds?:string[];html:string;toc:{id:string;title:string;depth:number}[];minutes:number};
export const posts:Post[]=data;
export const postHref=(post:Post)=>'/posts/'+post.id.replaceAll('-','.');
export const postLabel=(post:Post)=>post.overview?'Overview':post.id.replaceAll('-','.');
export const findPost=(slug:string)=>posts.find(p=>p.id.replaceAll('-','.')===slug)??posts.find(p=>p.legacyIds?.includes(slug)||p.sourceIds?.includes(slug)||(p.overview&&p.id===slug));
export const chapterNumber=(p:Post)=>Number(p.id.split("-")[0]);
export const chapters=Array.from(new Set(posts.map(p=>p.chapter))).map(title=>({title,number:chapterNumber(posts.find(p=>p.chapter===title)!),posts:posts.filter(p=>p.chapter===title)}));

