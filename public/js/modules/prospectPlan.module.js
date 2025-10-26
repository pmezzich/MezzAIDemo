export const manifest = { id:"prospect-plan", title:"🧭 Prospect Plan (Internal)", blurbShort:"Company name/URL → plan + 3 emails + Peter/Ease + module picks.", order: 50 };

export async function mount({ root, api }){
  root.innerHTML = `
    <input id="name" placeholder="Company name or URL" />
    <div class="row" style="display:flex; gap:8px; margin-top:8px">
      <select id="persona"><option>AE</option><option>SDR</option></select>
      <select id="tone"><option>friendly</option><option>neutral</option><option>formal</option></select>
    </div>
    <button id="go" style="margin-top:8px">Generate Plan</button>
    <pre id="out" class="mono"></pre>
  `;
  const $ = s=>root.querySelector(s);
  $("#go").onclick = async ()=>{
    const payload = { target: $("#name").value.trim(), persona: $("#persona").value, tone: $("#tone").value };
    $("#out").textContent = "Generating…";
    try{
      const data = await api.postFirst(["/api/prospect/plan","/prospect/plan"], payload);
      $("#out").textContent = JSON.stringify(data,null,2);
    }catch(e){ $("#out").textContent = e.message; }
  };
}
