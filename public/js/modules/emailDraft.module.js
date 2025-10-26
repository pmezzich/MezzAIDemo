export const manifest = { id:"email-draft", title:"✉️ Email Draft", blurbShort:"Paste an email to draft a reply.", order: 10 };

export async function mount({ root, api }){
  root.innerHTML = `
    <textarea id="t" placeholder="Paste email text here…"></textarea>
    <button id="go">Draft Reply</button>
    <pre id="out" class="mono"></pre>
  `;
  const $ = s=>root.querySelector(s);
  $("#go").onclick = async ()=>{
    const text = $("#t").value.trim();
    $("#out").textContent = "Drafting…";
    try{
      const data = await api.postFirst(["/api/email-draft","/email-draft","/v1/email"], { email: text });
      $("#out").textContent = typeof data==="string" ? data : JSON.stringify(data,null,2);
    }catch(e){ $("#out").textContent = e.message; }
  };
}
