import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join,relative,resolve,sep} from 'node:path';

const output=resolve(import.meta.dirname,'..','dist','pages');
const base='/rustless_note';
function htmlFiles(dir){
 return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const path=join(dir,entry.name);
  return entry.isDirectory()?htmlFiles(path):path.endsWith('.html')?[path]:[];
 });
}
const errors=[];
for(const file of htmlFiles(output)){
 if(file.includes(sep+'atlas'+sep))continue;
 const html=readFileSync(file,'utf8');
 for(const match of html.matchAll(/\b(?:href|src)="([^"]*)"/g)){
  const url=match[1];
  if(!url.startsWith('/'))continue;
  if(!url.startsWith(base+'/')){errors.push(relative(output,file)+': '+url);continue;}
  const pathname=url.slice(base.length).split(/[?#]/)[0];
  const target=pathname==='/'?join(output,'index.html'):join(output,pathname);
  if(!existsSync(target))errors.push(relative(output,file)+': missing '+url);
 }
}
if(errors.length)throw Error(errors.join('\n'));
console.log('All local links in '+htmlFiles(output).length+' HTML files resolve.');
