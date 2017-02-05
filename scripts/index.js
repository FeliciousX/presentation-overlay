const { echo, which, exit, exec, cp } = require('shelljs')

if (!which('git')) {
  echo('Sorry, this script requires git')
  exit(1)
}

if (exec('npm run build').code !== 0) {
  echo('Error: build failed')
  exit(1)
}

if (exec('git checkout gh-pages').code !== 0) {
  echo('Error: git checkout failed')
  exit(1)
}

cp('dist/index.html', 'index.html')
cp('dist/bundle.js', 'bundle.js')

exec('git add index.html bundle.js')
if (exec('git commit -am "deploy auto-commit"').code !== 0) {
  echo('Error: git commit failed')
  exit(1)
}

exec('git push origin gh-pages')
