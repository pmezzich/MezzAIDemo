const _mods = [];
export function register(mod){ if(mod && mod.manifest && typeof mod.mount==='function') _mods.push(mod); }
export function list(){ return _mods.sort((a,b)=> (a.manifest.order||0)-(b.manifest.order||0)); }
