export const manifest = { id:"lead-classifier", title:"🏷️ Lead Classifier", blurbShort:"Classify inbound messages (member / non-member / custom).", order: 15 };

export async function mount({ root, api }){
  root.innerHTML = `
    <textarea id="t" placeholder="Paste message…"></textarea>
    <button id="go">Classify</button>
    <pre id="out" class="mono"></pre>
  `;
  const $ = s=>root.querySelector(s);
  $("#go").onclick = async ()=>{
    const text = $("#t").value.trim();
    $("#out").textContent = "Classifying…";
    try{
      const data = await api.postFirst(["/api/classify","/classify","/v1/classify"], { text });
      $("#out").textContent = JSON.stringify(data,null,2);
    }catch(e){ $("#out").textContent = e.message; }
  };
}
