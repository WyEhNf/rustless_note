import {readFileSync,readdirSync,writeFileSync,mkdirSync} from "node:fs";
import {Marked} from "marked";
const escape=s=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
function compile(folder){
 const root=new URL('../content/'+folder+'/',import.meta.url),items=[];
 for(const file of readdirSync(root).filter(f=>f.endsWith(".md"))){
 const source=readFileSync(new URL(file,root),"utf8").replace(/^\uFEFF/,"");
 const match=source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
 if(!match)throw Error(file+": 缺少文章信息");
 const meta=JSON.parse(match[1]);
 for(const key of (folder==='articles'?["id","title","chapter","section","description"]:folder==='parts'?["id","title","number","description","chapters"]:["id","title","description"]))if(!meta[key])throw Error(file+": 缺少 "+key);
 if(meta.draft)continue;
 if(folder==='articles'&&!/^\d+-\d+$/.test(meta.id))throw Error(file+": 编号使用章、节两段数字");
 const toc=[];let n=0;
 const markdown=new Marked({gfm:true,renderer:{
  html({text}){return escape(text)},
  code({text,lang}){return '<pre data-language="'+escape(lang||'text')+'"><code>'+escape(text)+'</code></pre>\n'},
  paragraph({tokens}){const key=tokens.length===1&&tokens[0].type==="strong";return '<p'+(key?' class="key-idea"':'')+'>'+this.parser.parseInline(tokens)+'</p>\n'},
  heading({tokens,depth}){const text=this.parser.parseInline(tokens);const id="section-"+(++n);toc.push({id,title:text.replace(/<[^>]*>/g,""),depth});return '<h'+depth+' id="'+id+'">'+text+'</h'+depth+'>\n'},
  link({href,tokens}){const safe=/^(https?:|mailto:|\/|#)/i.test(href)?href:"#";return '<a href="'+escape(safe)+'">'+this.parser.parseInline(tokens)+'</a>'}
 }});
 const html=markdown.parse(match[2]);
 const count=match[2].replace(/\x60\x60\x60[\s\S]*?\x60\x60\x60/g,"").replace(/\s/g,"").length;
 items.push({...meta,html,toc,minutes:Math.max(1,Math.ceil(count/350))});
 }
 return items;
}
const posts=compile('articles');
posts.sort((a,b)=>{const x=a.id.split("-").map(Number),y=b.id.split("-").map(Number);return x[0]-y[0]||x[1]-y[1]});
if(new Set(posts.map(p=>p.id)).size!==posts.length)throw Error("文章编号重复");
mkdirSync(new URL("../lib/",import.meta.url),{recursive:true});
writeFileSync(new URL("../lib/posts.json",import.meta.url),JSON.stringify(posts,null,2)+"\n");
const partOrder=['frontend','semantic','pass1','pass2'];
const parts=compile('parts').sort((a,b)=>partOrder.indexOf(a.id)-partOrder.indexOf(b.id));
writeFileSync(new URL("../lib/parts.json",import.meta.url),JSON.stringify(parts,null,2)+"\n");
writeFileSync(new URL("../lib/guides.json",import.meta.url),JSON.stringify(compile('guides'),null,2)+"\n");
console.log("已整理 "+posts.length+" 篇文章");

