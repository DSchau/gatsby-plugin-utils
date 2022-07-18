const fs = require('fs')
const getNpmData = require('./get-npm-data')
const semver = require('semver')
const toCSV = require('./to-csv')

async function main() {
  const hits = await getNpmData()

  const packageVersions = hits.reduce((merged, hit) => {
    try {
      const deps = Object.assign({}, hit.devDependencies, hit.dependencies, hit.peerDependencies)
      const dep = deps.gatsby
      const ranges = [
        ['1.9.9', '1'],
        ['2.9.9', '2'],
        [ '3.9.9', '3'],
        ['4.9.9', '4'],
      ]

      const pkg = {
        name: hit.name,
        description: hit.description,
        version: hit.version,
        repository: hit.repository ? hit.repository.url : '',
        downloads: hit.downloads,
        lastUpdated: hit.lastUpdated,
        dependencies: hit.dependencies,
        devDependencies: hit.devDependencies || {},
      }

      let added = false
      for (const [version, versionName] of ranges) {

        if (semver.satisfies(version, dep)) {
          merged[versionName].push(pkg)
          added = true
        }
      }

      if (!added) {
        merged.unknown.push(pkg)
      }

      return merged
    } catch (e) {
      console.error(e)
      return merged
    }
  }, {
    1: [],
    2: [],
    3: [],
    4: [],
    'unknown': []
  })

  await fs.promises.writeFile('versions.csv', toCSV(packageVersions), 'utf8')
}

main()
  .then(() => {
    console.log('done')
  })
