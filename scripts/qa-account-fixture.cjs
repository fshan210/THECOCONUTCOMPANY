/* Local-only contract fixture. Never imported by the application or deployed routes. */
const http=require('node:http');
let unavailable=false;
let profile={firstName:'Afsala',lastName:'Khan',displayName:'Afsala Khan',phone:'+919876543210',newsletterOptIn:true,marketingOptIn:false};
let saved={productIds:['co-water','co-kitchen-coconut-oil','co-kitchen-coconut-milk','co-kitchen-coconut-flour'],recipeIds:['coconut-mango-cooler','tender-coconut-smoothie-bowl','kerala-coconut-vegetable-stew'],journalIds:[],communityIds:[],recentlyViewedProductIds:[]};
let addresses=[{addressId:'qa-address-home',fullName:'Afsala Khan',phone:'+919876543210',line1:'12 Palm Grove Road',line2:'',city:'Kochi',region:'Kerala',postalCode:'682025',country:'IN',isDefault:true},{addressId:'qa-address-work',fullName:'Afsala Khan',phone:'+919876543210',line1:'2nd Floor, Inspine Tech Park',city:'Kochi',region:'Kerala',postalCode:'682042',country:'IN',isDefault:false}];
const orders=Array.from({length:9},(_,i)=>({orderId:`QA-ILLUSTRATIVE-${78429-i}`,status:i?'DELIVERED':'IN_TRANSIT',placedAt:`2026-08-${String(28-i).padStart(2,'0')}T10:00:00Z`,total:360+i*50,currency:'INR',items:[{productId:'co-water',name:'.CO Water',quantity:2,price:120},{productId:'co-kitchen-coconut-oil',name:'.CO Kitchen Coconut Oil',quantity:1,price:250}]}));
http.createServer(async(req,res)=>{let raw='';for await(const chunk of req)raw+=chunk;let body;try{body=raw?JSON.parse(raw):{};}catch{res.writeHead(400).end();return;}
 const path=req.url;let data={};
 if(path==='/__qa/unavailable'){unavailable=true;data={ok:true};}
 else if(path==='/__qa/available'){unavailable=false;data={ok:true};}
 else if(unavailable&&['/v1/me','/v1/wishlist','/v1/me/addresses','/v1/orders'].includes(path)){res.writeHead(503,{'content-type':'application/json'}).end(JSON.stringify({error:'QA unavailable'}));return;}
 else if(path==='/__qa/empty'){saved={productIds:[],recipeIds:[],journalIds:[],communityIds:[],recentlyViewedProductIds:[]};addresses=[];orders.length=0;data={ok:true};}
 else if(path==='/__qa/saved'){saved={...saved,...body};data=saved;}
 else if(path==='/v1/me'){if(req.method==='PATCH')profile={...profile,...body};data={profile};}
 else if(path.startsWith('/v1/me/addresses')){const id=path.split('/')[4];if(req.method==='POST'){addresses.push({...body,addressId:`qa-address-${Date.now()}`});}if(req.method==='PATCH')addresses=addresses.map(a=>a.addressId===id?{...a,...body}:a);if(req.method==='DELETE')addresses=addresses.filter(a=>a.addressId!==id);data={items:addresses};}
 else if(path==='/v1/wishlist')data=saved;
 else if(path.startsWith('/v1/saved')){if(req.method==='DELETE'){const parts=path.split('/');body={kind:parts[3],itemId:decodeURIComponent(parts[4])};}const field={product:'productIds',recipe:'recipeIds',journal:'journalIds',community:'communityIds',recent:'recentlyViewedProductIds'}[body.kind];if(field)saved[field]=req.method==='DELETE'?saved[field].filter(x=>x!==body.itemId):[...new Set([...saved[field],body.itemId])];data=saved;}
 else if(path==='/v1/orders')data={items:orders};
 else if(path.startsWith('/v1/orders/'))data=orders.find(o=>o.orderId===decodeURIComponent(path.split('/').pop()))||{status:'NOT_IMPLEMENTED'};
 res.setHeader('content-type','application/json');res.end(JSON.stringify({data}));
}).listen(4319,'127.0.0.1',()=>console.log('Local account fixture listening on 4319. Synthetic data only.'));
