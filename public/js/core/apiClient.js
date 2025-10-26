const trim = (s="") => s.replace(/\/$/,"");
export function createApiClient(baseUrl=""){
  const BASE = trim(baseUrl);
  async function callFirst(paths, init){
    let lastErr;
    for(const p of paths){
      try{
        const r = await fetch(trim(BASE)+p, init);
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        const ct = r.headers.get("content-type")||"";
        return ct.includes("application/json") ? await r.json() : await r.text();
      }catch(e){ lastErr = e; }
    }
    throw lastErr || new Error("All endpoints failed");
  }
  return {
    getFirst: (paths) => callFirst(paths, { method:"GET" }),
    postFirst: (paths, body) => callFirst(paths, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body||{}) }),
  };
}
