const P=RAW.map(r=>({id:r[0],name:r[1],cat:r[2],price:r[3],sold:r[4],stock:r[5],lead:r[6]}));
let filter="all";
const $=id=>document.getElementById(id);
const inr=n=>"₹"+Math.round(n).toLocaleString("en-IN");
function calc(){
  const sd=+$("safety").value, th=+$("slow").value;
  $("sv").textContent=sd;$("tv").textContent=th;
  return P.map(p=>{
    const d=p.sold/90, rop=Math.round(d*p.lead+d*sd), re=p.stock<=rop, sl=p.sold<th;
    return {...p,d,rop,re,sl,qty:re?Math.max(0,Math.round(d*30+rop-p.stock)):0,val:p.stock*p.price};
  });
}
function bars(el,data,max){
  $(el).innerHTML=data.map(x=>`<div class="bar"><span class="nm">${x[0]}</span><span class="tr"><span class="fl" style="display:block;width:${x[1]/max*100}%"></span></span><span class="v">${x[1]}</span></div>`).join("");
}
function render(){
  const D=calc(), q=$("q").value.toLowerCase();
  const re=D.filter(x=>x.re).length, sl=D.filter(x=>x.sl), tv=D.reduce((a,x)=>a+x.val,0);
  $("kpis").innerHTML=[["Products",D.length,""],["Total stock value",inr(tv),""],["Reorder now",re,"warn"],["Slow-moving",sl.length,""],["Cash in slow items",inr(sl.reduce((a,x)=>a+x.val,0)),""]]
    .map(k=>`<div class="card kpi ${k[2]}"><b>${k[1]}</b><span>${k[0]}</span></div>`).join("");
  const tabs=[["all","All"],["re","Reorder now"],["sl","Slow-moving"],["ok","OK"]];
  $("tabs").innerHTML=tabs.map(t=>`<button class="tab ${filter===t[0]?"on":""}" onclick="filter='${t[0]}';render()">${t[1]}</button>`).join("");
  const list=D.filter(x=>x.name.toLowerCase().includes(q)&&(filter==="all"||(filter==="re"&&x.re)||(filter==="sl"&&x.sl)||(filter==="ok"&&!x.re)))
    .sort((a,b)=>b.re-a.re||a.stock/(a.rop||1)-b.stock/(b.rop||1));
  $("rows").innerHTML=list.map(x=>`<tr><td>${x.name}</td><td>${x.cat}</td><td class="n">${x.stock}</td><td class="n">${x.d.toFixed(1)}</td><td class="n">${x.rop}</td><td class="n">${x.lead}</td><td>${x.re?'<span class="badge b-re">Reorder Now</span> ':'<span class="badge b-ok">OK</span> '}${x.sl?'<span class="badge b-sl">Slow</span>':''}</td><td class="n">${x.qty||"–"}</td></tr>`).join("")||'<tr><td colspan="8">No products found</td></tr>';
  const top=[...D].sort((a,b)=>b.sold-a.sold).slice(0,10).map(x=>[x.name,x.sold]);
  bars("top",top,top[0][1]);
  const c={};D.forEach(x=>c[x.cat]=(c[x.cat]||0)+x.stock);
  const ce=Object.entries(c).sort((a,b)=>b[1]-a[1]);bars("cat",ce,ce[0][1]);
}
["safety","slow","q"].forEach(i=>$(i).addEventListener("input",render));
render();
 