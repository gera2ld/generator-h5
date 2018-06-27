exports.replaceContent = (ins, file, replace) => {
  const filePath = ins.destinationPath(file);
  const source = ins.fs.read(filePath);
  let content = replace(source);
  if (content === undefined) content = source;
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
  const res = ins.spawnCommandSync('yarn', ['--version']);
  if (res.error && res.error.code === 'ENOENT') {
    if (devDeps) ins.npmInstall(devDeps, { saveDev: true });
    if (deps) ins.npmInstall(deps);
  } else {
    if (devDeps) ins.yarnInstall(devDeps, { dev: true });
    if (deps) ins.yarnInstall(deps);
  }
};
