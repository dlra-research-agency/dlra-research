const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // Exclude page type reference templates from output
  eleventyConfig.ignores.add("src/_page_types/**");

  // Warn on unknown site type
  eleventyConfig.on("eleventy.before", () => {
    const site = require("./src/_data/site.json");
    const validTypes = ["local-business", "company", "product", "research"];
    if (site.type && !validTypes.includes(site.type)) {
      console.warn(`⚠ Unknown site.type "${site.type}" in site.json. Valid: ${validTypes.join(", ")}`);
    }
  });

  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/dlra-logo.png": "dlra-logo.png" });
  
  // Watch for changes in assets
  eleventyConfig.addWatchTarget("src/assets/");

  // Add a readable date filter
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Add ISO date filter for sitemap
  eleventyConfig.addFilter("date", (dateObj) => {
    const d = new Date(dateObj);
    return d.toISOString().split('T')[0];
  });

  // Add year shortcode for copyright
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Markdown-it instance
  const md = markdownIt({
    html: true,
    linkify: false,
    typographer: false,
  });

  // Markdown-to-HTML filter for Nunjucks pages
  eleventyConfig.addFilter("markdown", (content) => {
    if (!content) return "";
    return md.render(content);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html", "txt"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
