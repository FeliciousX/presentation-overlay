const sh = require('shelljs')

sh.config.silent = true

if (!sh.which('git')) {
  console.error('Sorry, this script requires git')
  sh.exit(1)
}

const commit = sh.exec('git log --oneline -1').stdout
console.log('At commit', commit)
console.log('Building with webpack...')

sh.exec('npm run build', { asnyc: true }, (code, stdout, stderr) => {
  if (code !== 0) {
    console.error(stderr)
    sh.exit(1)
  }

  console.log('Checking out to gh-pages...')
  if (sh.exec('git checkout gh-pages').code !== 0) {
    console.error('Error: git checkout failed')
    sh.exit(1)
  }

  console.log('Copying files...')
  sh.cp('dist/*', '*')

  console.log('Staging new files...')
  sh.exec('git add index.html bundle.js')

  console.log('Committing new files...')
  if (sh.exec(`git commit -am "deploys ${commit}"`).code !== 0) {
    console.error('Error: git commit failed')
    sh.exit(1)
  }

  console.log('Pushing to origin...')
  if (sh.exec('git push origin gh-pages').code !== 0) {
    console.error('Error: git push to origin failed')
    sh.exit(1)
  }

  console.log('Checking out to master...')
  sh.exec('git checkout master')
})
