import snapshot from '@/lib/nightshift/market-snapshot.json';
const wanted=new Set(['NVDAUSDT','TSLAUSDT','AAPLUSDT']);
export async function GET(){
 try{
 const response=await fetch('https://api.bitget.com/api/v2/mix/market/tickers?productType=USDT-FUTURES',{signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw Error('Upstream unavailable');
 const data=await response.json() as {code:string;data:Record<string,string>[]};
 if(data.code!=='00000'||!Array.isArray(data.data))throw Error('Invalid upstream response');
 const quotes=data.data.filter(q=>wanted.has(q.symbol)).map(q=>{const last=Number(q.lastPr),bid=Number(q.bidPr),ask=Number(q.askPr),timestamp=Number(q.ts),mid=(bid+ask)/2;return{symbol:q.symbol,last,bid,ask,timestamp,spread:bid>0&&ask>=bid?(ask-bid)/mid*100:null}}).filter(q=>q.last>0&&Number.isFinite(q.last)&&Number.isFinite(q.timestamp)&&q.timestamp>0);
 return Response.json({mode:'live',quotes,instrumentType:'USDT futures; not tokenized spot',fetchedAt:new Date().toISOString()},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({mode:'snapshot',quotes:snapshot.quotes,note:'Live request failed. Showing a previously retrieved Bitget snapshot, not current prices.',source:snapshot.source,retrievedAt:snapshot.retrievedAt},{headers:{'Cache-Control':'no-store'}})}
}
