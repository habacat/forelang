const markdownIt = require("markdown-it");
const mdAnchor = require("markdown-it-anchor");
const mdKatex = require("markdown-it-katex");

// Keep CJK characters unencoded for filesystem paths and URLs.
// Replace spaces with '-' and strip unsafe punctuation, but DO NOT percent-encode.
function cjkSlug(s){
  if(!s) return "";
  s = String(s).trim().replace(/\s+/g, "-");
  // Keep: Latin letters/digits/_-, CJK (中日韓), Hiragana/Katakana, Hangul.
  return s.replace(/[^A-Za-z0-9_\-\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]+/g, "");
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({"src/assets/favicon.ico": "favicon.ico"});
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/posts/**/*.pdf");

  eleventyConfig.addFilter("date", (d) => {
    const x = new Date(d);
    const pad = (n)=>String(n).padStart(2,"0");
    return `${x.getFullYear()}.${pad(x.getMonth()+1)}.${pad(x.getDate())}`;
  });
  eleventyConfig.addFilter("truncate", (s,n)=>{ if(!s) return ""; s=String(s); return s.length>n ? s.slice(0,n)+"…" : s; });
  eleventyConfig.addFilter("slug", cjkSlug);
  eleventyConfig.addFilter("readingTime", content=>{
    const words = (content||"").split(/\s+/).filter(Boolean).length;
    return `${Math.max(1,Math.round(words/250))} min`;
  });
  eleventyConfig.addFilter("indexOf", (arr, page)=>arr.findIndex(i=>i.url===page.url));

  // Use markdown-it with anchor; DO NOT override Eleventy's built-in 'url' filter.
  const md = markdownIt({html:true, linkify:true, typographer:true})
    .use(mdKatex)
    .use(mdAnchor, {slugify: cjkSlug});
  eleventyConfig.setLibrary("md", md);

  return {
    dir: { input:"src", includes:"_includes", data:"_data", output:"_site" },
    pathPrefix: "/forelang/"
  };
};
