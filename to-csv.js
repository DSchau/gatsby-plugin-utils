module.exports = versions => {
  const header = [
    'Name','Version','Gatsby Version','Description','Downloads','Last Updated','Repository',
  ].join(',')
  const rows = Object.keys(versions).reduce((merged, versionNumber) => {
    const pkgs = versions[versionNumber]
    return merged.concat(
      pkgs.map(pkg => [pkg.name, pkg.version, versionNumber, pkg.description, pkg.downloads, pkg.lastUpdated, pkg.repository])
    )
  }, []).map(row => row.join(','))

  return [
    header
  ].concat(rows).join('\n')
}
