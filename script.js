const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
$$(".tab").forEach(t=>t.onclick=()=>{$$(".tab,.mode").forEach(x=>x.classList.remove("active"));t.classList.add("active");$("#"+t.dataset.mode).classList.add("active")});

let cur="0", stored=null, op=null, fresh=false, memory=0;
const disp=$("#display"), hist=$("#history");
const fmt=n=>{if(!Number.isFinite(n))return "Error";let s=Number(n.toPrecision(12)).toString();return s.length>16?Number(n).toExponential(9):s};
function paint(){disp.textContent=cur}
function inputNum(n){if(cur==="Error"||fresh){cur=n;fresh=false}else cur=cur==="0"?n:cur+n;paint()}
function calc(){if(stored===null||!op)return Number(cur);let b=Number(cur),a=stored;return op==="+"?a+b:op==="-"?a-b:op==="*"?a*b:op==="/"?b===0?NaN:a/b:b}
$$("[data-num]").forEach(b=>b.onclick=()=>inputNum(b.dataset.num));
$$("[data-op]").forEach(b=>b.onclick=()=>{if(op&&!fresh){cur=fmt(calc());paint()}stored=Number(cur);op=b.dataset.op;hist.textContent=cur+" "+b.textContent;fresh=true});
$('[data-action="decimal"]').onclick=()=>{if(fresh){cur="0";fresh=false}if(!cur.includes("."))cur+=".";paint()};
$('[data-action="equals"]').onclick=()=>{if(op){let old=hist.textContent+" "+cur+" =";cur=fmt(calc());hist.textContent=old;stored=null;op=null;fresh=true;paint()}};
$('[data-action="clear"]').onclick=()=>{cur="0";stored=null;op=null;fresh=false;hist.textContent="";paint()};
$('[data-action="clear-entry"]').onclick=()=>{cur="0";paint()};
$('[data-action="backspace"]').onclick=()=>{if(!fresh){cur=cur.length>1?cur.slice(0,-1):"0";paint()}};
$('[data-action="sign"]').onclick=()=>{cur=fmt(-Number(cur));paint()};
$('[data-action="sqrt"]').onclick=()=>{cur=Number(cur)<0?"Error":fmt(Math.sqrt(Number(cur)));fresh=true;paint()};
$('[data-action="percent"]').onclick=()=>{cur=fmt(Number(cur)/100);paint()};
$('[data-action="reciprocal"]').onclick=()=>{cur=Number(cur)===0?"Error":fmt(1/Number(cur));fresh=true;paint()};
$('[data-action="memory"]').onclick=()=>{if(memory===0){memory=Number(cur);hist.textContent="M = "+fmt(memory)}else{cur=fmt(memory);fresh=true;paint()}};

// Scientific calculator
let sc="0", sa=null, so=null, sf=false;
const sd=$("#sci-display"), sh=$("#sci-history"); const sp=()=>sd.textContent=sc;
$$("[data-sci-num]").forEach(b=>b.onclick=()=>{if(sf||sc==="Error"){sc=b.dataset.sciNum;sf=false}else sc=sc==="0"?b.dataset.sciNum:sc+b.dataset.sciNum;sp()});
$$("[data-sci-op]").forEach(b=>b.onclick=()=>{if(so&&!sf){sc=fmt(scalc())}sa=Number(sc);so=b.dataset.sciOp;sf=true;sh.textContent=sc+" "+b.textContent;sp()});
function scalc(){let b=Number(sc);return so==="+"?sa+b:so==="-"?sa-b:so==="*"?sa*b:so==="/"?sa/b:so==="^"?Math.pow(sa,b):b}
$$("[data-sci]").forEach(b=>b.onclick=()=>{let a=b.dataset.sci,n=Number(sc);
 if(a==="clear"){sc="0";sa=null;so=null;sh.textContent="";sf=false}
 else if(a==="decimal"){if(sf){sc="0";sf=false}if(!sc.includes("."))sc+="."}
 else if(a==="equals"){if(so){sh.textContent+= " "+sc+" =";sc=fmt(scalc());sa=null;so=null;sf=true}}
 else if(a==="pi"){sc=fmt(Math.PI);sf=true}
 else if(a==="sin"){sc=fmt(Math.sin(n*Math.PI/180));sf=true}
 else if(a==="cos"){sc=fmt(Math.cos(n*Math.PI/180));sf=true}
 else if(a==="tan"){sc=fmt(Math.tan(n*Math.PI/180));sf=true}
 else if(a==="sqrt"){sc=n<0?"Error":fmt(Math.sqrt(n));sf=true}
 else if(a==="log"){sc=n<=0?"Error":fmt(Math.log10(n));sf=true}
 else if(a==="ln"){sc=n<=0?"Error":fmt(Math.log(n));sf=true}
 else if(a==="square"){sc=fmt(n*n);sf=true}
 else if(a==="reciprocal"){sc=n===0?"Error":fmt(1/n);sf=true}
 else if(a==="sign"){sc=fmt(-n)}
 else if(a==="percent"){sc=fmt(n/100)}
 else if(a==="pow"){sa=n;so="^";sf=true;sh.textContent=sc+" ^"}
 sp()});

// Converter
const units={
 length:{Meter:1,Kilometer:1000,Centimeter:.01,Millimeter:.001,Mile:1609.344,Yard:.9144,Foot:.3048,Inch:.0254},
 mass:{Kilogram:1,Gram:.001,Pound:.45359237,Ounce:.028349523125},
 volume:{Liter:1,Milliliter:.001,"US Gallon":3.785411784,"US Cup":.2365882365},
 temperature:{Celsius:"C",Fahrenheit:"F",Kelvin:"K"}
};
const cat=$("#category"),fu=$("#fromUnit"),tu=$("#toUnit"),fv=$("#fromValue"),tv=$("#toValue");
function loadUnits(){let names=Object.keys(units[cat.value]);fu.innerHTML=tu.innerHTML=names.map(x=>`<option>${x}</option>`).join("");tu.selectedIndex=1;convert()}
function convert(){let v=Number(fv.value);if(cat.value==="temperature"){let f=units.temperature[fu.value],t=units.temperature[tu.value],c=f==="C"?v:f==="F"?(v-32)*5/9:v-273.15;tv.value=fmt(t==="C"?c:t==="F"?c*9/5+32:c+273.15)}else tv.value=fmt(v*units[cat.value][fu.value]/units[cat.value][tu.value])}
cat.onchange=loadUnits; fu.onchange=tu.onchange=fv.oninput=convert; $("#swap").onclick=()=>{let x=fu.value;fu.value=tu.value;tu.value=x;convert()}; loadUnits();

// Keyboard support for standard mode
addEventListener("keydown",e=>{if(!$("#standard").classList.contains("active"))return;if(/\d/.test(e.key))inputNum(e.key);else if("+-*/".includes(e.key))document.querySelector(`[data-op="${e.key}"]`).click();else if(e.key==="Enter"||e.key==="=")$('[data-action="equals"]').click();else if(e.key==="Escape")$('[data-action="clear"]').click();else if(e.key==="Backspace")$('[data-action="backspace"]').click();else if(e.key===".")$('[data-action="decimal"]').click()});
