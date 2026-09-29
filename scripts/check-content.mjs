import {readFileSync,readdirSync,writeFileSync} from "node:fs";
const dir=new URL("../content/articles/",import.meta.url);
const baseline=JSON.parse(readFileSync(new URL("../content/merge-baseline.json",import.meta.url),"utf8"));
const revision=JSON.parse(readFileSync(new URL("../content/revision-map.json",import.meta.url),"utf8"));
const retained=id=>!revision.removedChapters.includes(Number(id.split(/[.-]/)[0]));
const revisedTarget=id=>revision.mergedArticles[id]??id;
const data=JSON.parse(readFileSync(new URL("../lib/posts.json",import.meta.url),"utf8"));
const parts=JSON.parse(readFileSync(new URL("../lib/parts.json",import.meta.url),"utf8"));
const errors=[],ids=new Set(),sourceIds=new Set(),aliases=new Map(),chapterIds=new Set();
let examples=0,negative=0,maxChars=0,headings=0,overviews=0,minOverviewChars=Infinity;
for(const file of readdirSync(dir).filter(x=>x.endsWith(".md"))){
 const text=readFileSync(new URL(file,dir),"utf8").replace(/\r\n/g,"\n").replace(/^\uFEFF/,"");
 const m=text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
 if(!m){errors.push(file+": 文章信息格式错误");continue;}
 const meta=JSON.parse(m[1]);if(meta.draft)continue;
 if(!/^\d+-\d+$/.test(meta.id))errors.push(file+": 文章按章、节两级编号");
 if(ids.has(meta.id))errors.push(file+": 重复编号");ids.add(meta.id);
 chapterIds.add(meta.id.split('-')[0]);
 for(const id of [...meta.legacyIds??[],...meta.sourceIds??[]]){
  if(aliases.has(id))errors.push(file+": 旧链接重复归属 "+id);
  aliases.set(id,meta.id);
 }
 for(const id of meta.sourceIds??[]){
  if(sourceIds.has(id))errors.push(file+": 提纲细点重复归属 "+id);
  if(!retained(id))errors.push(file+": 已删除章节的提纲细点仍在正文中 "+id);
  sourceIds.add(id);
 }
 const body=m[2],fences=body.match(/^\x60\x60\x60/gm)||[];
 if(fences.length%2)errors.push(file+": 代码围栏未闭合");
 if(fences.length<2)errors.push(file+": 缺少代码例子");
 const prose=body.replace(/\x60\x60\x60[\s\S]*?\x60\x60\x60/g,"");
 if(/不是|而是|并非|交付|诊断|握手/.test(text))errors.push(file+": 需要检查措辞");
 if(/^#+\s*(先看(?:代码|例子)|再?顺着(?:代码|例子)看)/m.test(body))errors.push(file+": 重复模板标题");
 if(/rx::|Analyzer::|check_expr\s*\(|build_expression\s*\(|#include\s*[<"]rx|src\/semantic\.cpp/.test(body))errors.push(file+": 出现项目实现片段");
 for(const link of text.matchAll(/\]\(\/posts\/([\d.-]+)(?:#[^)]*)?\)/g))
  if(!data.some(p=>p.id.replaceAll('-','.')===link[1]||p.legacyIds?.includes(link[1])||p.sourceIds?.includes(link[1])))errors.push(file+": 文章链接失效");
 if(!data.some(p=>p.id===meta.id&&p.html.includes("<pre ")))errors.push(file+": 网页内容未同步");
 examples+=fences.length/2;if(/错误|不匹配|拒绝|不支持|不符/.test(body))negative++;
 headings+=(prose.match(/^## /gm)??[]).length;
 const chars=prose.replace(/\s/g,"").length;maxChars=Math.max(maxChars,chars);
 const subheads=[...prose.matchAll(/^## (.+)$/gm)].map(m=>m[1]);
 if(subheads.length===0)errors.push(file+": 缺少小标题");
 if(subheads.some(h=>h.length>18))errors.push(file+": 小标题过长");
 if(meta.overview){
  overviews++;minOverviewChars=Math.min(minOverviewChars,chars);
  if(!meta.id.endsWith('-0'))errors.push(file+": 总览需要 x.0 编号");
  if(chars<650)errors.push(file+": 总览需要充分展开本章问题");
 }else if(meta.id.endsWith('-0'))errors.push(file+": x.0 应标为总览");
}
// Articles and examples may be edited; retained outline points and old links must remain accounted for.
for(const id of baseline.sections.filter(retained))if(!ids.has(revisedTarget(id)))errors.push("文章未覆盖："+id);
for(const id of baseline.sourceIds.filter(retained))if(!sourceIds.has(id))errors.push("提纲细点未覆盖："+id);
for(const [old,target] of Object.entries(revision.mergedArticles)){
 if(ids.has(old)||!ids.has(target))errors.push("文章合并未完成："+old);
 if(aliases.get(old.replaceAll('-','.'))!==target)errors.push("合并文章缺少旧地址："+old);
}
for(const ch of chapterIds)if(!data.some(p=>p.id===ch+'-0'&&p.overview))errors.push("本章缺少总览："+ch);
for(const [alias,target] of Object.entries(baseline.legacyAliases??{}))if(retained(target)&&aliases.get(alias)!==revisedTarget(target))errors.push("旧链接对应错误："+alias);
for(const post of data){
 if(!retained(post.id))errors.push("已删除章节仍在网页中："+post.id);
 if(parts.filter(part=>part.chapters.includes(Number(post.id.split('-')[0]))).length!==1)errors.push("章节归属不唯一："+post.id);
}
if(parts.some(part=>part.id==='extension'||part.chapters.some(ch=>revision.removedChapters.includes(ch))))errors.push("目录仍然包含附录");
if(data.length!==ids.size)errors.push("网页篇数未同步");
const summary={articles:ids.size,overviews,bodyArticles:ids.size-overviews,outlinePoints:sourceIds.size,legacyLinks:aliases.size,codeExamples:examples,articlesWithContrasts:negative,sectionHeadings:headings,minOverviewCharacters:minOverviewChars,maxProseCharacters:maxChars,errors};
writeFileSync(new URL("../content-check.json",import.meta.url),JSON.stringify(summary,null,2)+"\n");
console.log(JSON.stringify(summary,null,2));if(errors.length)process.exit(1);
