import Link from '@/lib/reading-link';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import guides from '@/lib/guides.json';
import {topParts,childrenOf,partChapters,partHref,type Part} from '@/lib/parts';
import {postHref} from '@/lib/posts';

const guide=guides.find(g=>g.id==='getting-started')!;
export const metadata={title:guide.title,description:guide.description};
function OverviewLinks({part}:{part:Part}){return <ul className="guide-overviews">{partChapters(part).map(chapter=>{const overview=chapter.posts.find(post=>post.overview)!;return <li key={chapter.number}><span>{String(chapter.number).padStart(2,'0')}</span><Link href={postHref(overview)}><span className="guide-overview-label">Overview</span>{overview.title}</Link></li>})}</ul>}
export default function GettingStarted(){return <main id="main" className="container article-page guide-page">
 <Link className="back-link" href="/"><ArrowLeft size={15}/> 首页</Link>
 <div className="post-layout"><article>
  <header className="post-header"><p className="eyebrow">阅读指南 <span>·</span> {guide.minutes} 分钟阅读</p><h1>{guide.title}</h1><p>{guide.description}</p></header>
  <div className="prose" dangerouslySetInnerHTML={{__html:guide.html}}/>
  <section id="reading-index" className="guide-index"><h2>导读与 Overview 目录</h2>{topParts.map(part=><section key={part.id} className="guide-part"><h3>{part.number}、{part.title.split('：')[0]}</h3><Link className="guide-intro-link" href={partHref(part)}><span>导读</span>{part.title}<ArrowRight size={16}/></Link><OverviewLinks part={part}/>{childrenOf(part).map(child=><section className="guide-stage" key={child.id}><h4>{child.title.split('：')[0]}</h4><Link className="guide-intro-link" href={partHref(child)}><span>导读</span>{child.title}<ArrowRight size={16}/></Link><OverviewLinks part={child}/></section>)}</section>)}</section>
  <section id="architecture" className="prose guide-atlases"><h2>架构图</h2><p>首页有两份架构图供参考。阅读导读与 Overview 时，可以对照图中的层次和连接，把当前讨论的部分放回整体中。</p><ul><li><Link href="/atlas/frontend.html">Frontend 架构图</Link>：展示 Crate、Item、块、语句、表达式与类型的关系。</li><li><Link href="/atlas/semantic.html">Semantic 架构图</Link>：展示 Pass1 的声明准备、Pass2 的表达式检查及其结果。</li></ul></section>
 </article><aside className="toc"><p>本篇内容</p><nav aria-label="文章目录">{guide.toc.map(h=><a href={'#'+h.id} key={h.id}>{h.title}</a>)}<a href="#reading-index">导读与 Overview 目录</a><a href="#architecture">架构图</a></nav><div className="toc-series"><Link href="/series">完整阅读目录 <ArrowRight size={14}/></Link></div></aside></div>
</main>}
