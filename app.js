const $=id=>document.getElementById(id),PAGE=48;let cur=[],shown=0;
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function opts(sel,pairs){const m=new Map();pairs.forEach(([k,l])=>{if(k&&!m.has(k))m.set(k,l)});
 [...m].sort((a,b)=>a[1].localeCompare(b[1],'zh')).forEach(([k,l])=>sel.add(new Option(l,k)))}
opts($('fCity'),DATA.map(r=>[r.city,r.city_zh+' '+r.city_en]));
opts($('fGu'),DATA.map(r=>[r.city+'|'+r.gu,r.city_zh+'・'+r.gu_zh+' '+r.gu_en]));
opts($('fAward'),DATA.flatMap(r=>r.awards.map(a=>[a.k,a.zh+' / '+a.en])));
opts($('fCat'),DATA.map(r=>[r.cat,r.cat_zh+' '+r.cat_en]));
opts($('fKind'),DATA.map(r=>[r.kind,r.kind_zh+' '+r.kind_en]));
function card(r){
 const aw=r.awards.map(a=>`<span class="aw ${a.k=='bib'?'bib':a.g!='michelin'&&a.g!='bluer'?'t':''}"><a style="color:inherit;text-decoration:none" href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.zh)}<br><small>${esc(a.en)}</small></a></span>`).join('');
 const dishes=r.dishes.length?r.dishes.map(d=>`<div><span class="dish">${esc(d.ko)}</span> / ${esc(d.en)} <small>(${esc(d.zh)})</small></div>`).join(''):'官方資料未列出';
 const site=r.site?`<a href="${esc(r.site)}" target="_blank" rel="noopener">官方網站 Website</a>`:`<a class="s" href="${esc(r.src_page)}" target="_blank" rel="noopener">來源頁面 Source page</a>`;
 return `<article class="card"><div class="ph">${r.img?`<img loading="lazy" src="${r.img}" alt="${esc(r.name_en)}">`:'🍽️'}</div><div class="b">
 <h2>${esc(r.name_ko)}</h2><h3>${esc(r.name_en)}</h3>
 <div class="tags">${aw}<span>${r.city_zh} ${r.city_en}</span><span>${r.gu_zh} ${r.gu_en}</span><span>${r.cat_zh} ${r.cat_en}</span><span>${r.kind_zh} ${r.kind_en}</span>${r.cuisine_zh?`<span>${esc(r.cuisine_zh)} ${esc(r.cuisine_en)}</span>`:''}</div>
 <div class="row"><b>招牌／推薦菜單：</b>${dishes}</div>
 <div class="row"><b>地址：</b>${esc(r.addr_ko)}<br>${esc(r.addr_en)}</div>
 <div class="row"><b>營業時間：</b>${esc(r.hours)}</div>
 <div class="row"><b>介紹：</b>${esc(r.desc)}</div>
 <div class="links"><a class="g" href="${esc(r.google)}" target="_blank" rel="noopener">Google Map</a><a class="n" href="${esc(r.naver)}" target="_blank" rel="noopener">Naver Map</a>${site}</div></div></article>`}
function more(){const s=cur.slice(shown,shown+PAGE);$('list').insertAdjacentHTML('beforeend',s.map(card).join(''));shown+=s.length;$('more').style.display=shown<cur.length?'block':'none'}
function apply(){const q=$('q').value.trim().toLowerCase(),c=$('fCity').value,g=$('fGu').value,a=$('fAward').value,k=$('fCat').value,t=$('fKind').value;
 cur=DATA.filter(r=>(!c||r.city==c)&&(!g||r.city+'|'+r.gu==g)&&(!a||r.awards.some(x=>x.k==a))&&(!k||r.cat==k)&&(!t||r.kind==t)&&
 (!q||(r.name_ko+r.name_en+r.addr_ko+r.addr_en+r.desc+r.dishes.map(d=>d.ko+d.en+d.zh).join()).toLowerCase().includes(q)));
 $('list').innerHTML='';shown=0;$('count').textContent=`共 ${cur.length} / ${DATA.length} 間`;more()}
['fCity','fGu','fAward','fCat','fKind'].forEach(i=>$(i).onchange=apply);$('q').oninput=apply;$('moreBtn').onclick=more;apply();
