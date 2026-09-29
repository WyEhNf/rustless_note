import Link from '@/lib/reading-link';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import {posts,postHref,postLabel} from '@/lib/posts';
import {topParts,partHref,partChapters,childrenOf,type Part} from '@/lib/parts';

export const metadata={title:'阅读目录',description:'从 Frontend 建树到 Semantic，再依次展开 Pass1 与 Pass2。'};
function Questions({part,nested=false}:{part:Part;nested?:boolean}){return partChapters(part).map(chapter=><section key={chapter.number} id={'chapter-'+chapter.number} className="chapter-section"><div className="chapter-heading"><span>{String(chapter.number).padStart(2,'0')}</span>{nested?<h4>{chapter.title}</h4>:<h3>{chapter.title}</h3>}</div><div className="outline-section">{chapter.posts.map(post=><Link key={post.id} href={postHref(post)} className={post.overview?'outline-overview':undefined}><span className="outline-number">{postLabel(post)}</span><span className="outline-copy"><strong>{post.title}</strong><span>{post.description}</span></span><ArrowUpRight size={16}/></Link>)}</div></section>)}
function QuestionLinks({part}:{part:Part}){return <div className="chapter-jumps">{partChapters(part).map(ch=><a key={ch.number} href={'#chapter-'+ch.number}><span>{ch.number}</span>{ch.title}</a>)}</div>}
export default function Series(){return <main id="main" className="container series-page">
 <header className="page-heading"><p className="eyebrow">READING PATH</p><h1>程序结构与语义分析</h1><p>Frontend 讲建树；Semantic 先说明检查主线，再分为 Pass1 与 Pass2，依次展开声明和表达式。</p></header>
 <div className="series-layout"><aside className="series-nav" aria-label="章节导航">{topParts.map(part=><div className="part-nav-group" key={part.id}><a className="part-nav-title" href={'#'+part.id}><span>{part.number}</span>{part.title.split('：')[0]}</a><QuestionLinks part={part}/>{childrenOf(part).map(child=><div className="stage-nav-group" key={child.id}><a className="stage-nav-title" href={'#'+child.id}>{child.title.split('：')[0]}</a><QuestionLinks part={child}/></div>)}</div>)}<p>两章主线 · {posts.length} 篇细读</p></aside>
 <div>{topParts.map(part=><section key={part.id} id={part.id} className="reading-part">
  <header className="part-heading"><span className="part-number">{part.number}</span><div><p className="eyebrow">章节导读</p><h2><Link href={partHref(part)}>{part.title}</Link></h2><p>{part.description}</p><Link className="part-start" href={partHref(part)}>从这里读起 <ArrowRight size={16}/></Link></div></header>
  <Questions part={part}/>
  {childrenOf(part).map(child=><section key={child.id} id={child.id} className="reading-stage"><header className="stage-heading"><p className="eyebrow">SEMANTIC / {child.id.toUpperCase()}</p><h3><Link href={partHref(child)}>{child.title}</Link></h3><p>{child.description}</p><Link className="part-start" href={partHref(child)}>阅读这一阶段的主线 <ArrowRight size={16}/></Link></header><Questions part={child} nested/></section>)}
 </section>)}</div></div>
</main>}
