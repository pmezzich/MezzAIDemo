import { loadTenantConfig } from "./core/config.js";
import { createApiClient } from "./core/apiClient.js";
import { register, list } from "./core/registry.js";
import { ui } from "./core/ui.js";

// Import modules (stubs and basics)
import * as gptPlayground from "./modules/gptPlayground.module.js";
import * as emailDraft from "./modules/emailDraft.module.js";
import * as leadClassifier from "./modules/leadClassifier.module.js";
import * as pieDashboard from "./modules/pieDashboard.module.js";
import * as miniChat from "./modules/miniChat.module.js";

import * as analyticsNarrator from "./modules/analyticsNarrator.module.js";
import * as policyFaqBot from "./modules/policyFaqBot.module.js";
import * as messageInsights from "./modules/messageInsights.module.js";
import * as calendarConcierge from "./modules/calendarConcierge.module.js";
import * as prospectPlan from "./modules/prospectPlan.module.js";
import * as crmSync from "./modules/crmSync.module.js";

[gptPlayground, emailDraft, leadClassifier, pieDashboard, miniChat,
 analyticsNarrator, policyFaqBot, messageInsights, calendarConcierge, prospectPlan, crmSync
].forEach(register);

(async function boot(){
  const cfg = await loadTenantConfig();
  const api = createApiClient(cfg.backendUrl || "");

  // header
  document.getElementById("beUrl").textContent = cfg.backendUrl || "none";
  document.getElementById("tenantName").textContent = cfg.name || "default";

  const dot = document.getElementById("healthDot");
  const msg = document.getElementById("healthMsg");
  try{
    await api.getFirst(["/api/health","/health","/.well-known/health"]);
    dot.classList.add("ok"); msg.textContent = "OK";
    document.getElementById("envLabel").textContent = "backend";
  }catch(e){
    msg.textContent = "no backend"; document.getElementById("envLabel").textContent = "local";
  }

  const wrap = document.getElementById("wrap");
  const enabled = cfg.modules || {};

  for(const mod of list()){
    const id = mod.manifest.id;
    if(!enabled[id]) continue;
    const slotHolder = document.createElement("div");
    wrap.appendChild(slotHolder);
    try {
      const slot = ui.mountCard(slotHolder, mod.manifest.title, mod.manifest.blurbShort || "");
      await mod.mount({ root: slot, api, config: cfg });
    } catch(e){
      slotHolder.innerHTML = `<div class="card"><strong>${mod.manifest.title}</strong><div class="small" style="color:#f87171">Error mounting module: ${e.message}</div></div>`;
    }
  }
})();
