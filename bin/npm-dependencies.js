const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const backupPackageJsonPath = path.join(__dirname, '..', 'package.json_BACKUP');

const add = () => {
  const packgeJsonContent = fs.readFileSync(packageJsonPath);
  const PackageJson = JSON.parse(packgeJsonContent);

  const modifiedPackgeJson = Object.assign(
    {},
    PackageJson,
    {
      dependencies: Object.assign(
        {},
        PackageJson.dependencies,
        PackageJson.npmDependencies
      )
    }
  );
  const modifiedPackgeJsonContent = JSON.stringify(modifiedPackgeJson, null, 2);

  fs.renameSync(packageJsonPath, backupPackageJsonPath);
  fs.writeFileSync(packageJsonPath, modifiedPackgeJsonContent);
};

const remove = () => {
  fs.unlinkSync(packageJsonPath);
  fs.renameSync(backupPackageJsonPath, packageJsonPath);
};

const args = process.argv.slice(2);

if (args.indexOf('--delete') !== -1) {
  remove();
} else {
  add();
}
