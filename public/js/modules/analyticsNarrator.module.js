export const manifest = { id:"analytics-narrator", title:"📈 Analytics Narrator (Demo)", blurbShort:"Summarize KPIs from JSON. Seeded file + upload supported.", order: 30 };

function fmtDelta(p){ return (p>0?"+":"") + p + "%"; }

export async function mount({ root }){
  root.innerHTML = `
    <div class="subcard">
      <button id="dl">Download Example JSON</button>
      <input id="up" type="file" accept="application/json" />
    </div>
    <pre id="raw" class="mono small"></pre>
    <div id="summary"></div>
  `;
  const $ = s=>root.querySelector(s);
  $("#dl").onclick = ()=> location.href = "./storage/public/analytics/seed.analytics.v1.json";
  $("#up").onchange = async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const text = await f.text();
    try{
      const obj = JSON.parse(text);
      $("#raw").textContent = JSON.stringify(obj,null,2);
      const s = narrate(obj);
      $("#summary").innerHTML = s;
    }catch(err){ $("#raw").textContent = err.message; }
  };
  // Pre-load the seed for convenience (no automatic analysis)
  const seed = await fetch("./storage/public/analytics/seed.analytics.v1.json").then(r=>r.json()).catch(()=>null);
  if(seed){ $("#raw").textContent = JSON.stringify(seed,null,2); }
}
function narrate(d){
  if(!d || !d.kpis) return "<div class='small muted'>Missing KPIs</div>";
  const k = d.kpis;
  const lines = [];
  if(k.inbound_tickets) lines.push(`Tickets ${fmtDelta(k.inbound_tickets.delta_pct)} to ${k.inbound_tickets.value}.`);
  if(k.first_response_time_min) lines.push(`FRT ${fmtDelta(k.first_response_time_min.delta_pct)} to ${k.first_response_time_min.value} min.`);
  if(k.csat) lines.push(`CSAT ${fmtDelta(k.csat.delta_pct)} at ${k.csat.value}.`);
  if(k.revenue_pipeline_usd) lines.push(`Pipeline ${fmtDelta(k.revenue_pipeline_usd.delta_pct)} to $${k.revenue_pipeline_usd.value}.`);
  if(k.meetings_booked) lines.push(`Meetings ${fmtDelta(k.meetings_booked.delta_pct)} to ${k.meetings_booked.value}.`);
  return `<div class="subcard">${lines.join(" ")}</div>`;
}
