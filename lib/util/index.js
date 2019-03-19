exports.replaceContent = (ins, file, replace) => {
  const filePath = ins.destinationPath(file);
  let source;
  try {
    source = ins.fs.read(filePath);
  } catch (err) {
    return;
  }
  let content = replace(source);
  if (content === undefined) content = source;
  ins.fs.write(filePath, content);
};

let addedWebpackConfig = false;
exports.addWebpackConfig = (ins, replacements = {}) => {
  const filePath = ins.destinationPath('scripts/webpack.conf.js');
  let source;
  if (addedWebpackConfig) {
    source = ins.fs.read(filePath);
  } else {
    source = ins.fs.read(`${__dirname}/templates/scripts/webpack.conf.js`);
  }
  let content = source;
  const { plugins } = replacements;
  if (plugins) content = content.replace('/** WEBPACK_PLUGINS **/', m => `${plugins}${m}`);
  ins.fs.write(filePath, content);
};

exports.replaceJSON = (ins, file, replace) => {
  const filePath = ins.destinationPath(file);
  const source = ins.fs.readJSON(filePath);
  let content = replace(source);
  if (content === undefined) content = source;
  ins.fs.writeJSON(filePath, content);
};

exports.install = (ins, devDeps, deps) => {
  if (hasYarn(ins)) {
    if (devDeps) ins.yarnInstall(devDeps, { dev: true });
    if (deps) ins.yarnInstall(deps);
  } else {
    if (devDeps) ins.npmInstall(devDeps, { saveDev: true });
    if (deps) ins.npmInstall(deps);
  }
};

let _hasYarn;
function hasYarn(ins) {
  if (_hasYarn == null) {
    const res = ins.spawnCommandSync('yarn', ['--version']);
    _hasYarn = !(res.error && res.error.code === 'ENOENT');
  }
  return _hasYarn;
}
