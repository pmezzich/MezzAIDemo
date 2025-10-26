export const manifest = { id:"policy-faq-bot", title:"📚 Policy & FAQ Bot (Demo)", blurbShort:"Ask questions against a long public doc (YouTube ToS).", order: 35 };

export async function mount({ root }){
  root.innerHTML = `
    <div class="subcard small">Demo uses a public document. <a href="./storage/public/blurbs/policy-faq-bot.md" target="_blank">About</a></div>
    <div class="subcard">
      <a href="./storage/public/policy-faq/youtube_tos.pdf" download>Download YouTube ToS (PDF)</a> (placeholder—upload real PDF to Storage)
    </div>
    <input id="q" placeholder="Ask a policy question…" />
    <button id="ask">Ask</button>
    <div id="out"></div>
  `;
  const $ = s=>root.querySelector(s);
  $("#ask").onclick = ()=>{
    $("#out").innerHTML = "<div class='small muted'>Demo placeholder. Wire /api/faq/ask to enable answers with citations.</div>";
  };
}
