export const manifest = { id:"mini-chat", title:"💬 Mini Chat", blurbShort:"Quick chat with your configured model.", order: 25 };

export async function mount({ root, api }){
  root.innerHTML = `
    <input id="m" placeholder="Say something…" />
    <button id="go">Send</button>
    <pre id="out" class="mono"></pre>
  `;
  const $ = s=>root.querySelector(s);
  $("#go").onclick = async ()=>{
    const m = $("#m").value.trim();
    $("#out").textContent = "Thinking…";
    try{
      const data = await api.postFirst(["/api/chat","/chat","/v1/chat"], { message: m });
      $("#out").textContent = typeof data==="string" ? data : JSON.stringify(data,null,2);
    }catch(e){ $("#out").textContent = e.message; }
  };
}
