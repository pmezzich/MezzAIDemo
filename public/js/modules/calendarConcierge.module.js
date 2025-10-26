export const manifest = { id:"calendar-concierge", title:"📅 Calendar Concierge", blurbShort:"Two emails + date range → 3 slots (9–5) if calendars are public.", order: 45 };

export async function mount({ root, api }){
  root.innerHTML = `
    <div class="subcard">
      <input id="org" placeholder="your email" />
      <input id="inv" placeholder="their email" />
      <div class="row" style="display:flex; gap:8px; margin-top:8px">
        <input id="from" type="date" />
        <input id="to" type="date" />
        <select id="dur">
          <option value="30">30 min</option>
          <option value="15">15 min</option>
          <option value="45">45 min</option>
          <option value="60">60 min</option>
        </select>
      </div>
      <button id="go" style="margin-top:8px">Find times</button>
    </div>
    <div id="out"></div>
  `;
  const $ = s=>root.querySelector(s);
  $("#go").onclick = async ()=>{
    const payload = { organizer: $("#org").value.trim(), invitee: $("#inv").value.trim(), from: $("#from").value, to: $("#to").value, durationMin: +$("#dur").value };
    $("#out").textContent = "Checking…";
    try{
      const pub1 = await api.getFirst([`/api/calendar/public?email=${encodeURIComponent(payload.organizer)}`]);
      const pub2 = await api.getFirst([`/api/calendar/public?email=${encodeURIComponent(payload.invitee)}`]);
      if(!pub1.public || !pub2.public){ $("#out").innerHTML = `<div class='subcard'>calendar not public for ${!pub1.public?payload.organizer:""} ${!pub2.public?payload.invitee:""}</div>`; return; }
      const slots = await api.postFirst(["/api/calendar/suggest","/calendar/suggest"], payload);
      $("#out").innerHTML = Array.isArray(slots.slots) && slots.slots.length
        ? `<ul>${slots.slots.slice(0,3).map(s=>`<li>${new Date(s.startISO).toLocaleString()} — ${new Date(s.endISO).toLocaleString()}</li>`).join("")}</ul>`
        : "<div class='small muted'>No slots found.</div>";
    }catch(e){ $("#out").textContent = e.message; }
  };
}
