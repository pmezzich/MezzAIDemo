export const manifest = { id:"gpt-playground", title:"🧪 GPT Playground", blurbShort:"Freeform GPT testing. Uses your backend if configured.", order: 5 };

export async function mount({ root, api }){
  root.innerHTML = `
    <textarea id="prompt" placeholder="Type a prompt..."></textarea>
    <button id="go">Run</button>
    <pre id="out" class="mono"></pre>
  `;
  const $ = s=>root.querySelector(s);
  $("#go").onclick = async ()=>{
    const prompt = $("#prompt").value.trim();
    $("#out").textContent = "Running...";
    try{
      const data = await api.postFirst(["/api/gpt/run","/gpt","/v1/chat"], { prompt });
      $("#out").textContent = typeof data==="string" ? data : JSON.stringify(data,null,2);
    }catch(e){ $("#out").textContent = e.message; }
  };
}
