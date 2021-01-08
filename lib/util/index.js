const depMap = require('./deps.json').dependencies;

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

exports.concatList = (...args) => args.filter(Boolean).flat();

exports.loadDeps = (depList) => depList.reduce((res, key) => {
  if (!depMap[key]) throw new Error(`${key} is not found`);
  res[key] = depMap[key];
  return res;
}, {});

exports.install = (ins) => {
  if (hasYarn(ins)) {
    ins.yarnInstall();
  } else {
    ins.npmInstall();
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
