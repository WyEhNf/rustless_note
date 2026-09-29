import Link from '@/lib/reading-link';
import {notFound} from 'next/navigation';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import {parts,partHref,partChapters,readingOrder,parentOf,childrenOf} from '@/lib/parts';
import {postHref} from '@/lib/posts';

export function generateStaticParams(){
 return parts.map(part=>({slug:part.id}));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,part=parts.find(p=>p.id===slug);
 return {title:part?.title??'章节未找到',description:part?.description};
}
export default async function PartPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,part=parts.find(p=>p.id===slug);if(!part)notFound();
 const index=readingOrder.findIndex(p=>p.href===partHref(part)),previous=readingOrder[index-1],next=readingOrder[index+1];
 return <main id="main" className="container article-page part-page">
  <Link className="back-link" href={part.parent?partHref(parentOf(part)!):'/series#'+part.id}><ArrowLeft size={15}/> {part.parent?'二 · Semantic':'阅读目录'}</Link>
  <div className="post-layout"><article>
   <header className="post-header"><p className="eyebrow">{part.parent?'Semantic / '+part.title.split('：')[0]:part.number==='附'?'附录':'第'+part.number+'章'} <span>·</span> {part.minutes} 分钟阅读</p><h1>{part.title}</h1><p>{part.description}</p></header>
   <div className="prose" dangerouslySetInnerHTML={{__html:part.html}}/>
   <section className="overview-sections" aria-label="本章展开"><h2>章节目录</h2>{partChapters(part).map(chapter=><Link key={chapter.number} href={postHref(chapter.posts[0])}><span>{chapter.number}</span><div><strong>{chapter.title}</strong><p>{chapter.posts[0].description}</p></div><ArrowRight size={16}/></Link>)}{childrenOf(part).map(child=><Link key={child.id} href={partHref(child)}><span>{child.number}</span><div><strong>{child.title}</strong><p>{child.description}</p></div><ArrowRight size={16}/></Link>)}</section>
   <nav className="post-pagination" aria-label="文章翻页">{previous?<Link href={previous.href}><span><ArrowLeft size={14}/> 上一篇</span><strong>{previous.title}</strong></Link>:<div/>}{next&&<Link href={next.href}><span>下一篇 <ArrowRight size={14}/></span><strong>{next.title}</strong></Link>}</nav>
  </article><aside className="toc"><p>本章主线</p><nav aria-label="文章目录">{part.toc.map(h=><a key={h.id} href={'#'+h.id} style={{paddingLeft:(h.depth-2)*12}}>{h.title}</a>)}</nav><div className="chapter-reading"><p>阅读顺序</p><nav>{parts.map(p=><Link key={p.id} href={partHref(p)} style={p.parent?{paddingLeft:18}:undefined} aria-current={part.id===p.id?'page':undefined}><span>{p.parent?'↳':p.number}</span>{p.title.split('：')[0]}</Link>)}</nav></div></aside></div>
 </main>;
}
