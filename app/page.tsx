import Link from '@/lib/reading-link';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import guides from '@/lib/guides.json';
const guide=guides.find(g=>g.id==='getting-started')!;
import {topParts,partHref,childrenOf} from '@/lib/parts';

export default function Home(){return <main id="main" className="container home">
 <section className="rustless-intro"><p className="eyebrow">RUSTLESS / 编译器阅读笔记</p><h1 className="journey-title"><span>千里之行，</span><span>始于足下。</span></h1></section>
 <section className="start-guide" aria-label="阅读指南"><p className="eyebrow">阅读指南</p><Link href="/getting-started"><h2>How to Get Started</h2><ArrowUpRight size={23}/></Link><p>{guide.description}</p></section>
 <section className="atlas-section" aria-label="架构图"><div className="section-heading"><h2>架构图</h2><span>两张架构图</span></div><div className="atlas-grid">{[{id:'frontend',title:'Frontend · AST 的结构',caption:'从 Crate、Item 到块与表达式',tag:'CST → AST'},{id:'semantic',title:'Semantic · 两遍检查',caption:'从全局声明到函数体中的表达式',tag:'Pass1 → Pass2'}].map(atlas=><a className="atlas-card" href={'/atlas/'+atlas.id+'.html'} key={atlas.id} aria-label={'打开'+atlas.title}><div className="atlas-window"><div className="window-bar" aria-hidden="true"><span>● ● ●</span><span>{atlas.id}.atlas</span><ArrowUpRight size={15}/></div><div className={'atlas-image '+atlas.id}><img src={'/atlas/'+atlas.id+'.png'} alt={atlas.title+'架构图预览'}/><span className="atlas-open">打开完整图 <ArrowUpRight size={15}/></span></div></div><div className="atlas-caption"><div><h3>{atlas.title}</h3><p>{atlas.caption}</p></div><span>{atlas.tag}</span></div></a>)}</div></section>
 <section className="reading-starts"><div className="section-heading"><h2>章节一览</h2><Link className="all-posts" href="/series">完整目录 <ArrowRight size={15}/></Link></div><div className="part-cards">{topParts.map(part=><article className="part-card" key={part.id}><span className="part-card-number">{part.number}</span><div><h3><Link href={partHref(part)}>{part.title}</Link></h3><p>{part.description}</p>{childrenOf(part).length>0&&<div className="stage-links">{childrenOf(part).map(child=><Link key={child.id} href={partHref(child)}>{child.title.split('：')[0]} <ArrowRight size={14}/></Link>)}</div>}</div><Link href={partHref(part)} aria-label={'阅读'+part.title}><ArrowUpRight size={20}/></Link></article>)}</div></section>
</main>}

