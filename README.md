## gatsby-version-utils

A script to generate a CSV (comma separated value) for looking up analytics on Gatsby package versions. Use cases are varied, but include things like seeing distribution of Gatsby major versions support, slicing and dicing into different kinds of plugins (like source plugins), etc. 

## Usage

1. Clone repo from GitHub
1. Install dependencies: `npm install`
1. Run generate script with: `npm run generate`
    - Give ~10-15 minutes for script to run. It will generate a `hits.json` (cached data) as well as a `versions.csv` which is the useful data to analyze
    - In generating the cached file, future runs will be faster
1. Analyze the CSV data, e.g. using Google Sheets, local analysis tools, etc.
    - Note: for Gatsby Employees, data is persisted in [this Google Sheet](https://docs.google.com/spreadsheets/d/1kh3X452X79DBL0oTJl_fOgzMPrXjWjaLjdkdV0IV3RM/edit?usp=sharing)

## Data Model

The Algolia NPM script does not include peerDependencies, so we have to use the Algolia script to look up packages and then we use NPM's API to enrich the data. The final data model in the CSV is as follows:

- `Name`: The name of the package
- `Version`: The "latest" tag of the package
- `Gatsby Version`: The version of Gatsby that the plugin claims to support
    - Algorithm: peerDependencies.gatsby || dependencies.gatsby || devDependencies.gatsby and then uses semver to validate support (e.g. ^2.0.0 means "any 2.x version")
- `Description`: The description of the package
- `Downloads`: # of Downloads (last 30 days) for the package
- `Last Updated`: Last updated timestamp
- `Repository`: If found, the path to the Git repository
