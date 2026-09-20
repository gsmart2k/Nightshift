export const symbols = ['NVDA','TSLA','AAPL'] as const;
export type SymbolName = typeof symbols[number];
export type Portfolio = Record<SymbolName,number> & {cash:number};
export type Stress = {shocks:Record<SymbolName,number>;spread:number;fee:number;slippage:number;reduction:number;depth:number;verified:boolean;hours:number};
export const initialPortfolio:Portfolio = {NVDA:5000,TSLA:3000,AAPL:2000,cash:2000};
export const initialStress:Stress = {shocks:{NVDA:-12,TSLA:-9,AAPL:-5},spread:1,fee:.1,slippage:.2,reduction:30,depth:5000,verified:true,hours:8};
export function calculate(p:Portfolio,s:Stress){
 const numbers=[...symbols.map(k=>p[k]),p.cash,s.spread,s.fee,s.slippage,s.reduction,s.depth,s.hours,...symbols.map(k=>s.shocks[k])];
 if(numbers.some(v=>!Number.isFinite(v)))throw Error('All inputs must be finite numbers.');
 if([...symbols.map(k=>p[k]),p.cash].some(v=>v<0||v>1e9))throw Error('Position values must be between 0 and 1 billion.');
 if(symbols.some(k=>s.shocks[k]<-100||s.shocks[k]>100)||s.reduction<0||s.reduction>100||s.spread<0||s.spread>20||s.fee<0||s.fee>5||s.slippage<0||s.slippage>10||s.depth<0||s.depth>1e9||s.hours<1||s.hours>24)throw Error('Scenario inputs are outside supported ranges.');
 const invested=symbols.reduce((a,k)=>a+p[k],0),total=invested+p.cash;
 const rows=symbols.map(symbol=>({symbol,value:p[symbol],shock:s.shocks[symbol],pnl:p[symbol]*s.shocks[symbol]/100,weight:total?p[symbol]/total*100:0}));
 const pnl=rows.reduce((a,r)=>a+r.pnl,0),sell=invested*s.reduction/100,cost=sell*(s.spread/2+s.fee+s.slippage)/100,reducedPnl=pnl*(1-s.reduction/100)-cost;
 const reasons=[...(!s.verified?['Event source is unverified.']:[]),...(sell>s.depth?['Planned sale exceeds assumed executable depth.']:[]),...(s.spread>2?['Full spread exceeds the 2% research guardrail.']:[])];
 return {total,invested,rows,pnl,holdValue:total+pnl,returnPct:total?pnl/total*100:0,sell,cost,reducedPnl,reducedValue:total+reducedPnl,difference:reducedPnl-pnl,blocked:reasons.length>0,reasons,concentration:total?Math.max(...rows.map(r=>r.value))/total*100:0};
}
export const episodes=[
 {id:'carry',title:'When crowded trades unwind',date:'05 AUG 2024',publisher:'Bank for International Settlements',url:'https://www.bis.org/publ/bisbull90.htm',fact:'BIS links the August turbulence to deleveraging and carry-trade unwinds.',relevance:'A shared liquidity shock can affect several positions at once.',limit:'A market-structure analogy, not a measured return forecast for these holdings.',shocks:{NVDA:-12,TSLA:-9,AAPL:-5},spread:1,tags:['liquidity','carry','yen','selloff','crash','correlation','overnight']},
 {id:'fed',title:'A policy decision on a Sunday',date:'15 MAR 2020',publisher:'Federal Reserve',url:'https://www.federalreserve.gov/newsevents/pressreleases/monetary20200315a.htm',fact:'The Fed announced a 0–0.25% target range in a Sunday evening statement.',relevance:'Material policy news can arrive while the regular US equity session is closed.',limit:'Pandemic conditions were exceptional. These shocks are illustrative, not actual 2020 returns.',shocks:{NVDA:-18,TSLA:-20,AAPL:-12},spread:2.5,tags:['fed','policy','rate','sunday','weekend','macro','pandemic']},
 {id:'earnings',title:'One earnings release, a wider question',date:'21 FEB 2024',publisher:'NVIDIA Investor Relations',url:'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2024',fact:'NVIDIA reported $22.1 billion in quarterly revenue for fiscal Q4 2024.',relevance:'Test how a company-specific surprise could change a concentrated portfolio.',limit:'The positive shock is an assumption, not a reconstruction of the subsequent share-price move.',shocks:{NVDA:12,TSLA:1,AAPL:2},spread:.5,tags:['nvidia','nvda','earnings','ai','revenue','technology','surprise']}
];
export function retrieveEpisodes(question:string){const words=question.toLowerCase().split(/\W+/).filter(Boolean);return episodes.map(e=>({...e,score:e.tags.filter(t=>words.includes(t)).length})).sort((a,b)=>b.score-a.score);}
