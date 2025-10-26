export async function loadTenantConfig(){
  // Local dev fallback: read /public/config/local-tenant.json
  try {
    const cfg = await fetch("./config/local-tenant.json").then(r=>r.json());
    return cfg;
  } catch(e){
    return { name:"default", backendUrl:"", modules:{} };
  }
}
