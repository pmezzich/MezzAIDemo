export const ui = {
  mountCard(root, title, blurbShort){
    root.innerHTML = `<div class="card"><strong>${title}</strong><p class="small muted">${blurbShort||""}</p><div class="slot"></div></div>`;
    return root.querySelector(".slot");
  }
};
