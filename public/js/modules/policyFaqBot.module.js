export const manifest = {
  id:"policy-faq-bot",
  title:"📚 ToS Summarizer + Chat (Demo)",
  blurbShort:"Summarizes our demo ToS and answers questions from that text only.",
  order: 35
};

// --- Utilities ---
const STOP = new Set(("a an and are as at be but by for from has have if in into is it its of on or such that the their then there these this to was were will with you your we our not only demo use terms service services output outputs privacy data law liability limitation warranty warranties governing changes contact appendix acceptable reverse engineer benchmark ai-generated warranties").split(/\s+/));

function tokenize(s=""){
  return (s.toLowerCase().match(/[a-z][a-z0-9'-]*/g) || []).filter(w=>!STOP.has(w));
}

function splitSections(text){
  const lines = text.split(/\r?\n/);
  const sections = [];
  let current = { title:"Preamble", body:[] };
  const isHead = (l)=>/^\s*(\d+\.|appendix|[A-Z][\w\s]{3,}:)/i.test(l.trim());
  for(const line of lines){
    if(isHead(line)){
      if(current.body.length) sections.push({ ...current, body: current.body.join("\n").trim() });
      current = { title: line.trim(), body: [] };
    } else {
      current.body.push(line);
    }
  }
  if(current.body.length) sections.push({ ...current, body: current.body.join("\n").trim() });
  return sections.filter(s=>s.body && s.body.length>0);
}

function buildIndex(sections){
  // TF-IDF over sections
  const docs = sections.map(s => tokenize(s.title + " " + s.body));
  const vocab = new Map();
  docs.forEach(tokens => tokens.forEach(t => vocab.set(t, (vocab.get(t)||0)+1)));
  const idf = new Map();
  for(const [t, df] of vocab) idf.set(t, Math.log((1+docs.length)/(1+df)) + 1);
  const vectors = docs.map(tokens => {
    const tf = new Map();
    tokens.forEach(t => tf.set(t, (tf.get(t)||0)+1));
    const vec = new Map();
    for(const [t, c] of tf) vec.set(t, (c / tokens.length) * (idf.get(t) || 0));
    // l2 normalize
    const norm = Math.sqrt(Array.from(vec.values()).reduce((a,b)=>a+b*b,0)) || 1;
    for(const k of vec.keys()) vec.set(k, vec.get(k)/norm);
    return vec;
  });
  function embedQuery(q){
    const toks = tokenize(q);
    const tf = new Map();
    toks.forEach(t => tf.set(t, (tf.get(t)||0)+1));
    const vec = new Map();
    for(const [t, c] of tf){
      const idfv = idf.get(t) || 0;
      vec.set(t, (c / toks.length) * idfv);
    }
    const norm = Math.sqrt(Array.from(vec.values()).reduce((a,b)=>a+b*b,0)) || 1;
    for(const k of vec.keys()) vec.set(k, vec.get(k)/norm);
    return vec;
  }
  function cosineSim(v1, v2){
    let sum = 0;
    const shorter = v1.size < v2.size ? v1 : v2;
    const longer = v1.size < v2.size ? v2 : v1;
    for(const [k, w] of shorter){
      sum += w * (longer.get(k) || 0);
    }
    return sum;
  }
  return {
    search(query, k=3){
      const qv = embedQuery(query);
      const scored = vectors.map((v,i)=>({ i, score: cosineSim(qv, v) }));
      scored.sort((a,b)=>b.score-a.score);
      return scored.slice(0,k).filter(s=>s.score>0.05).map(s=>({ section: sections[s.i], score: s.score }));
    }
  };
}

function extractiveAnswer(hits, question){
  if(!hits.length) return "I couldn't find a direct answer to that in the demo ToS.";
  // pick the most relevant sentences from top hit bodies
  const sentences = hits.flatMap(h => h.section.body.split(/(?<=[.!?])\s+/).map(txt => ({ txt, title: h.section.title, score: h.score })));
  const qTokens = tokenize(question);
  function sentScore(s){
    const t = tokenize(s.txt);
    const overlap = t.filter(w=>qTokens.includes(w)).length;
    return overlap + (s.score || 0);
  }
  sentences.sort((a,b)=>sentScore(b)-sentScore(a));
  const answer = sentences.slice(0,3).map(s=>s.txt).join(" ");
  const cites = [...new Set(sentences.slice(0,3).map(s=>s.title))].map(t=>`[${t}]`).join(" ");
  return answer + (cites ? ` ${cites}` : "");
}

function makeSummary(text){
  const sections = splitSections(text);
  // abstract: first 2-3 longer sentences from the beginning
  const preamble = sections[0]?.body || text;
  const sent = preamble.split(/(?<=[.!?])\s+/).filter(s=>s.split(" ").length>8);
  const abstract = (sent.slice(0,3).join(" ")) || "Demo ToS: evaluation-only, no warranties, limited liability, and NY law.";
  const keyHeads = ["Acceptable Use","AI-Generated Outputs","Privacy","Limitations of Liability","Governing Law","Changes"];
  const keys = keyHeads.map(h=>{
    const sec = sections.find(s => new RegExp(h,"i").test(s.title));
    return sec ? `• ${h}: ${sec.body.split(/(?<=[.!?])\s+/)[0]}` : null;
  }).filter(Boolean);
  return { abstract, keys, sections };
}

export async function mount({ root }){
  root.innerHTML = `
    <div class="subcard small">This demo uses our own ToS PDF (not YouTube's).</div>
    <div class="subcard">
      <button id="dl">Download PDF</button>
    </div>
    <div class="subcard">
      <div><b>Executive Summary</b></div>
      <div id="sum" class="small"></div>
      <div id="keys" class="small" style="margin-top:6px"></div>
    </div>
    <div class="subcard">
      <div><b>Ask about these Terms</b></div>
      <input id="q" placeholder="e.g., What are the limits of liability?"/>
      <button id="ask">Ask</button>
      <div id="a" class="small" style="margin-top:8px"></div>
    </div>
    <details class="subcard">
      <summary><b>Raw Text</b></summary>
      <pre id="raw" class="mono small"></pre>
    </details>
  `;
  const $ = s=>root.querySelector(s);

  const PDF_URL = "./storage/public/policy-faq/seeded_tos_demo.pdf";
  const TXT_URL = "./storage/public/policy-faq/seeded_tos_demo.txt";

  $("#dl").onclick = ()=> location.href = PDF_URL;

  try {
    const txt = await fetch(TXT_URL).then(r=>r.text());
    $("#raw").textContent = txt;
    const { abstract, keys, sections } = makeSummary(txt);
    $("#sum").textContent = abstract;
    $("#keys").innerHTML = keys.length ? `<ul>${keys.map(k=>`<li>${k}</li>`).join("")}</ul>` : "<div class='small muted'>No key sections detected.</div>";
    const index = buildIndex(sections);

    $("#ask").onclick = ()=>{
      const q = $("#q").value.trim();
      if(!q){ $("#a").textContent = "Ask a question about the ToS."; return; }
      const hits = index.search(q, 3);
      const ans = extractiveAnswer(hits, q);
      $("#a").textContent = ans;
    };
  } catch (e){
    $("#sum").textContent = "Could not load the ToS text file. Check the Storage path.";
  }
}
