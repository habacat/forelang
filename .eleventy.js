
const markdownIt = require("markdown-it");
const mdAnchor = require("markdown-it-anchor");
const mdToc = require("markdown-it-table-of-contents");
const mdKatex = require("markdown-it-katex");

function cjkSlug(s){
  if(!s) return "";
  return encodeURIComponent(String(s).trim().replace(/\s+/g,'-'));
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
  eleventyConfig.addFilter("truncate", (s,n)=>{
    if(!s) return "";
    s = String(s);
    return s.length>n ? s.slice(0,n) + "…" : s;
  });
  eleventyConfig.addFilter("slug", cjkSlug);
  eleventyConfig.addFilter("readingTime", content=>{
    const words = (content||"").split(/\s+/).filter(Boolean).length;
    return `${Math.max(1,Math.round(words/250))} min`;
  });
  eleventyConfig.addFilter("indexOf", (arr, page)=>arr.findIndex(i=>i.url===page.url));
  eleventyConfig.addFilter("url", u=>u);

  // collections
  eleventyConfig.addCollection("posts", api =>
    api.getFilteredByGlob("src/posts/**/*.{md,html}")
       .sort((a,b)=>b.date-a.date)
  );

  eleventyConfig.addCollection("tagList", api => {
    const counts = {};
    api.getFilteredByGlob("src/posts/**/*.{md,html}").forEach(item=>{
      (item.data.tags||[]).forEach(t=>{
        if(t==="post") return;
        counts[t]=(counts[t]||0)+1;
      });
    });
    return Object.entries(counts).map(([tag,count])=>({tag,count})).sort((a,b)=>b.count-a.count);
  });

  // markdown
  const md = markdownIt({html:true, linkify:true, typographer:true})
    .use(mdKatex)
    .use(mdAnchor, {slugify: cjkSlug})
    .use(mdToc, {includeLevel:[2,3], containerHeaderHtml:'<div class="toc-title">章节预览</div>'});
  eleventyConfig.setLibrary("md", md);

  return {
    dir: { input:"src", includes:"_includes", data:"_data", output:"_site" },
    pathPrefix: "/forelang/"
  };
};
