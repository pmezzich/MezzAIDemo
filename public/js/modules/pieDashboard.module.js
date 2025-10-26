export const manifest = { id:"pie-dashboard", title:"🥧 Live Pie Dashboard (Seeded)", blurbShort:"Renders a pie from seeded data (local or Firebase).", order: 20 };

export async function mount({ root }){
  // Load seed from local demo path
  const data = await fetch("./demo-data/pie-dashboard/dataset_v1.json").then(r=>r.json()).catch(()=>null);
  if(!data){ root.innerHTML = "<div class='small' style='color:#f87171'>No seed found.</div>"; return; }

  // render simple text pie summary (no Chart.js dependency in scaffold)
  const total = data.values.reduce((a,b)=>a+b,0);
  root.innerHTML = `<div class="subcard"><b>Total:</b> ${total}</div>` + data.labels.map((l,i)=>`
    <div class="subcard"><b>${l}:</b> ${data.values[i]}</div>`).join("");
}
