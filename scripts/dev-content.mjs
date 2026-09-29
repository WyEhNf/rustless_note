import {watch} from "node:fs";import {spawnSync,spawn} from "node:child_process";
const build=()=>spawnSync(process.execPath,["scripts/content.mjs"],{stdio:"inherit"});
if(build().status)process.exit(1);
let timer;const watchers=["content/articles","content/parts","content/guides"].map(dir=>watch(dir,()=>{clearTimeout(timer);timer=setTimeout(build,150)}));
const child=spawn(process.execPath,["scripts/run-framework.mjs","dev"],{stdio:"inherit"});
child.on("exit",code=>{watchers.forEach(w=>w.close());process.exit(code??0)});
for(const signal of ["SIGINT","SIGTERM"])process.on(signal,()=>{watchers.forEach(w=>w.close());child.kill(signal)});

