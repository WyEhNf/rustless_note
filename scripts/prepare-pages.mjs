import {copyFileSync,existsSync,mkdirSync,readFileSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {basename,dirname,join,relative,resolve,sep} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const source=join(root,'dist','client');
const output=join(root,'dist','pages');
const base='/rustless_note';
const outputParent=resolve(root,'dist')+sep;
if(!output.startsWith(outputParent))throw Error('Invalid Pages output path');
if(!existsSync(join(source,'index.html')))throw Error('Static export is missing index.html');
rmSync(output,{recursive:true,force:true});
mkdirSync(output,{recursive:true});

function files(dir){
 return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const path=join(dir,entry.name);
  return entry.isDirectory()?files(path):[path];
 });
}
function copy(sourceFile,targetFile){
 mkdirSync(dirname(targetFile),{recursive:true});
 copyFileSync(sourceFile,targetFile);
}
const htmlFiles=files(source).filter(path=>path.endsWith('.html')&&!path.includes(sep+'atlas'+sep));
const routes=new Set(htmlFiles.map(path=>{
 const name='/'+relative(source,path).replaceAll('\\','/').replace(/\.html$/,'');
 return name==='/index'?'/':name;
}));
for(const path of files(join(root,'public')))copy(path,join(output,relative(join(root,'public'),path)));
const cssFiles=files(join(source,'_next','static','css')).filter(path=>path.endsWith('.css'));
for(const path of cssFiles)copy(path,join(output,'assets',basename(path)));

function publicUrl(value){
 if(!value.startsWith('/')||value.startsWith('//'))return value;
 const match=value.match(/^([^?#]*)(.*)$/);
 const path=match[1],suffix=match[2];
 if(path.startsWith('/_next/static/css/'))return base+'/assets/'+basename(path)+suffix;
 if(path==='/')return base+'/'+suffix;
 if(routes.has(path))return base+path+'.html'+suffix;
 if(path.startsWith('/atlas/')||path==='/favicon.svg')return base+path+suffix;
 throw Error('Unrecognized site URL: '+value);
}
for(const path of htmlFiles){
 let html=readFileSync(path,'utf8');
 // The reading site uses ordinary links; its prerendered pages need no React runtime.
 html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
 html=html.replace(/<link\b[^>]*rel="modulepreload"[^>]*\/?\s*>/gi,'');
 html=html.replace(/\sdata-rsc-css-href="[^"]*"/g,'');
 html=html.replace(/\b(href|src)="([^"]*)"/g,(_,attribute,value)=>attribute+'="'+publicUrl(value)+'"');
 copy(path,join(output,relative(source,path)));
 writeFileSync(join(output,relative(source,path)),html);
}

const posts=JSON.parse(readFileSync(join(root,'lib','posts.json'),'utf8'));
const aliases=new Map();
for(const post of posts){
 const canonical=post.id.replaceAll('-','.');
 for(const alias of [...(post.legacyIds??[]),...(post.sourceIds??[])]){
  if(alias===canonical||routes.has('/posts/'+alias))continue;
  if(!/^[\w.-]+$/.test(alias))throw Error('Invalid article alias: '+alias);
  if(aliases.has(alias)&&aliases.get(alias)!==canonical)throw Error('Duplicate article alias: '+alias);
  aliases.set(alias,canonical);
 }
}
for(const [alias,canonical] of aliases){
 const target=base+'/posts/'+canonical+'.html';
 const html='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url='+target+'"><link rel="canonical" href="'+target+'"></head><body><a href="'+target+'">前往文章</a></body></html>\n';
 const path=join(output,'posts',alias+'.html');
 mkdirSync(dirname(path),{recursive:true});
 writeFileSync(path,html);
}
writeFileSync(join(output,'.nojekyll'),'');
console.log('Pages ready: '+htmlFiles.length+' pages, '+aliases.size+' old article links, '+cssFiles.length+' stylesheets');
