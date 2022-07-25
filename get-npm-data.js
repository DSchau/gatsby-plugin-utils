const fs = require("fs");
const axios = require("axios");
const _ = require("lodash");
const search = require("./search");

const CACHED_DATA_NAME = "hits.json";

module.exports = async () => {
  /*
   * This will short circuit the data enrichment and use the cache file
   * Comment out if you want to make changes to the data model, e.g. add a new field
   */
  if (fs.existsSync(CACHED_DATA_NAME)) {
    return fs.promises
      .readFile(CACHED_DATA_NAME)
      .then((file) => JSON.parse(file));
  }

  const keywords = ["gatsby", "gatsby-plugin"];

  const buildFilter = keywords.map((keyword) => `keywords:${keyword}`);

  const hits = await search({
    filters: `(${buildFilter.join(` OR `)})`,
    hitsPerPage: 1000,
  });

  let total = hits.length;

  let enriched_hits = [];

  for (const batch of _.chunk(hits, 25)) {
    enriched_hits = enriched_hits.concat(
      await Promise.all(
        batch.map((pkg) => {
          return axios(`https://registry.npmjs.org/${pkg.name}/${pkg.version}`)
            .then((res) => {
              return Object.assign({}, res.data, {
                description: `"${pkg.description
                  // .replace(/,/g, '","')
                  .replace(/\n/g, " ")}"`,
                downloads: pkg.downloadsLast30Days,
                lastUpdated: new Date(pkg.modified),
              });
            })
            .catch(() => null);
        })
      ).then((all) => all.filter(Boolean))
    );

    console.log(`progress: ${enriched_hits.length} of ${total}`);
  }

  await fs.promises.writeFile(
    "hits.json",
    JSON.stringify(enriched_hits, null, 2),
    "utf8"
  );

  return enriched_hits;
};
