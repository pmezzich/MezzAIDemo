export const manifest = { id:"message-insights", title:"🔎 Message Insights", blurbShort:"Intent + priority + churn risk. Live-only.", order: 40 };

export async function mount({ root, api }){
  root.innerHTML = `
    <textarea id="t" placeholder="Paste an inbound message…"></textarea>
    <button id="go">Analyze</button>
    <pre id="out" class="mono"></pre>
  `;
  const $ = s=>root.querySelector(s);
  $("#go").onclick = async ()=>{
    const text = $("#t").value.trim();
    $("#out").textContent = "Analyzing…";
    try{
      const data = await api.postFirst(["/api/messages/insights","/messages/insights"], { text });
      $("#out").textContent = JSON.stringify(data,null,2);
    }catch(e){ $("#out").textContent = e.message; }
  };
}
