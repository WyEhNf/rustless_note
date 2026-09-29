import {spawnSync} from 'node:child_process';

const env={...process.env,GITHUB_PAGES:'true',NEXT_PUBLIC_BASE_PATH:''};
for(const script of ['content.mjs','run-framework.mjs']){
 const args=script==='run-framework.mjs'?[script,'build']:[script];
 const result=spawnSync(process.execPath,['scripts/'+args[0],...args.slice(1)],{stdio:'inherit',env});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status??1);
}
const result=spawnSync(process.execPath,['scripts/prepare-pages.mjs'],{stdio:'inherit',env});
if(result.error)throw result.error;
if(result.status!==0)process.exit(result.status??1);
