
const markdownIt = require("markdown-it");
const mdAnchor = require("markdown-it-anchor");
const mdKatex = require("markdown-it-katex");

function slugAll(s){
  if(!s) return "";
  const raw = String(s).trim();
  // Try a simple ASCII slug first
  const ascii = raw
    .normalize("NFKD")
    .replace(/\s+/g,"-")
    .replace(/[^\x00-\x7F]/g,"")
    .replace(/[^a-zA-Z0-9\-]/g,"")
    .toLowerCase();
  if(ascii) return ascii;
  // Fallback: hex of code points for CJK and other non-ASCII
  let hex = "";
  for(const ch of raw){
    hex += ch.codePointAt(0).toString(16);
  }
  return hex;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({"src/assets/favicon.ico": "favicon.ico"});
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/posts/**/*.pdf");

  // filters
  eleventyConfig.addFilter("date", (d) => {
    const x = new Date(d);
    const pad = (n)=>String(n).padStart(2,"0");
    return `${x.getFullYear()}.${pad(x.getMonth()+1)}.${pad(x.getDate())}`;
  });
  eleventyConfig.addFilter("truncate", (s,n)=>{ if(!s) return ""; s=String(s); return s.length>n ? s.slice(0,n)+"…" : s; });
  eleventyConfig.addFilter("slug", slugAll);
  eleventyConfig.addFilter("readingTime", content=>{
    const words = (content||"").split(/\s+/).filter(Boolean).length;
    return `${Math.max(1,Math.round(words/250))} min`;
  });
  eleventyConfig.addFilter("indexOf", (arr, page)=>arr.findIndex(i=>i.url===page.url));

  // HTML -> TOC filter (from rendered HTML)
  eleventyConfig.addFilter("toc", function (html) {
    if(!html) return "";
    const tagre = /<(h2|h3)[^>]*id="([^"]+)"[^>]*>(.*?)<\/\1>/gsi;
    const all = []; let m;
    while((m = tagre.exec(html))){
      const level = m[1] === 'h2' ? 2 : 3;
      all.push({level, id: m[2], text: m[3].replace(/<[^>]+>/g,"")});
    }
    if(!all.length) return "";
    let out = '<div class="toc-title">章节预览</div><ol>';
    let h2=0,h3=0,open=false;
    for(const it of all){
      if(it.level===2){
        if(open){ out += "</ol></li>"; open=false; h3=0; }
        h2++; out += `<li><a href="#${it.id}">${h2}. ${it.text}</a>`;
      }else{
        if(!open){ out += "<ol>"; open=true; }
        h3++; out += `<li><a href="#${it.id}">${h2}.${h3} ${it.text}</a></li>`;
      }
    }
    if(open){ out += "</ol>"; }
    out += "</li></ol>";
    return out;
  });

  // collections
  eleventyConfig.addCollection("posts", api =>
    api.getFilteredByGlob("src/posts/**/*.{md,html}")
       .sort((a,b)=>b.date-a.date)
  );
  eleventyConfig.addCollection("tagList", api => {
    const counts = {};
    api.getFilteredByGlob("src/posts/**/*.{md,html}").forEach(item=>{
      (item.data.tags||[]).forEach(t=>{ if(t==="post") return; counts[t]=(counts[t]||0)+1; });
    });
    return Object.entries(counts).map(([tag,count])=>({tag,count})).sort((a,b)=>b.count-a.count);
  });

  const md = markdownIt({html:true, linkify:true, typographer:true})
    .use(mdKatex)
    .use(mdAnchor, {slugify: slugAll});
  eleventyConfig.setLibrary("md", md);

  return {
    dir: { input:"src", includes:"_includes", data:"_data", output:"_site" },
    pathPrefix: "/forelang/"
  };
};
