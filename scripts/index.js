const { which, exit, exec, cp } = require('shelljs')

if (!which('git')) {
  console.error('Sorry, this script requires git')
  exit(1)
}

console.log('Building with webpack...')

exec('npm run build', { asnyc: true, silent: true }, (code, stdout, stderr) => {
  if (code !== 0) {
    console.error(stderr)
    exit(1)
  }

  const commit = exec('git log --oneline -1', { silent: true })
  if (exec('git checkout gh-pages').code !== 0) {
    console.error('Error: git checkout failed')
    exit(1)
  }

  cp('dist/index.html', 'index.html')
  cp('dist/bundle.js', 'bundle.js')

  exec('git add index.html bundle.js')
  if (exec(`git commit -am "deploys ${commit}"`).code !== 0) {
    console.error('Error: git commit failed')
    exit(1)
  }

  if (exec('git push origin gh-pages').code !== 0) {
    console.error('Error: git push to origin failed')
    exit(1)
  }
  exec('git checkout master')
})
