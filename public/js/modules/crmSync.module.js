export const manifest = { id:"crm-sync", title:"🔗 CRM Sync (Future)", blurbShort:"Push responder/insight events into CRM (HubSpot/Salesforce).", order: 55 };

export async function mount({ root }){
  root.innerHTML = `<div class="subcard small">Placeholder. Wire /api/crm/* endpoints to enable.</div>`;
}
