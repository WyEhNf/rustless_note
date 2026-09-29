import Link from "@/lib/reading-link";
import {notFound,redirect} from "next/navigation";
import {ArrowLeft,ArrowRight} from "lucide-react";
import {posts,chapterNumber,findPost,postHref,postLabel} from "@/lib/posts";
import {partFor,partHref,readingOrder,parentOf} from '@/lib/parts';

export function generateStaticParams(){
 return posts.map(post=>({slug:post.id.replaceAll('-','.')}));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const p=findPost(slug);
 return {title:p?.title??"文章未找到",description:p?.description};
}
export default async function Article({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const post=findPost(slug);if(!post)notFound();
 if(slug!==post.id.replaceAll('-','.'))redirect(postHref(post));
 const index=readingOrder.findIndex(p=>p.href===postHref(post)),previous=readingOrder[index-1],next=readingOrder[index+1],part=partFor(post);
 const chapterPosts=posts.filter(p=>p.chapter===post.chapter);
 return <main id="main" className="container article-page">
  <div className="article-crumbs">{parentOf(part)&&<><Link href={partHref(parentOf(part)!)}>二 · Semantic</Link><span>/</span></>}<Link href={partHref(part)}>{!part.parent&&part.number+' · '}{part.title.split('：')[0]}</Link><span>/</span><Link href={'/series#chapter-'+chapterNumber(post)}>{post.chapter}</Link></div>
  <div className="post-layout"><article>
   <header className="post-header"><p className="eyebrow">{post.overview?'Overview':'例子与讨论 '+postLabel(post)} <span>·</span> {post.minutes} 分钟阅读</p><h1>{post.title}</h1><p>{post.description}</p></header>
   <div className="prose" dangerouslySetInnerHTML={{__html:post.html}}/>
   {post.overview&&<section className="overview-sections" aria-label="本章正文"><h2>分节目录</h2>{chapterPosts.filter(p=>!p.overview).map(p=><Link key={p.id} href={postHref(p)}><span>{postLabel(p)}</span><div><strong>{p.title}</strong><p>{p.description}</p></div><ArrowRight size={16}/></Link>)}</section>}
   <nav className="post-pagination" aria-label="文章翻页">
    {previous?<Link href={previous.href}><span><ArrowLeft size={14}/> 上一篇</span><strong>{previous.title}</strong></Link>:<div/>}
    {next&&<Link href={next.href}><span>下一篇 <ArrowRight size={14}/></span><strong>{next.title}</strong></Link>}
   </nav>
  </article><aside className="toc">
   {post.toc.length>0&&<><p>本篇内容</p><nav aria-label="文章目录">{post.toc.map(h=><a key={h.id} href={'#'+h.id} style={{paddingLeft:(h.depth-2)*12}}>{h.title}</a>)}</nav></>}
   <div className="chapter-reading"><p>这一组问题</p><nav aria-label="本章文章">{chapterPosts.map(p=><Link key={p.id} href={postHref(p)} aria-current={p.id===post.id?'page':undefined}><span>{postLabel(p)}</span>{p.title}</Link>)}</nav></div>
   <div className="toc-series"><Link href={'/series#chapter-'+chapterNumber(post)}>返回阅读目录 <ArrowRight size={14}/></Link></div>
  </aside></div>
 </main>
}
