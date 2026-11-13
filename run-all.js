// Starts the backend, builds both frontends and starts them, all in one terminal.
//   node run-all.js          build, then start (production mode)
//   node run-all.js --dev    skip the build, start in dev mode
// Ctrl+C stops everything.

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dev = process.argv.includes('--dev');

if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Installing dependencies once for all folders...');
  spawnSync('npm install --no-audit --no-fund', { cwd: __dirname, shell: true, stdio: 'inherit' });
}

const apps = [
  ['01-backend', 'node server.js', 'http://localhost:4000'],
  ['02-theme-context', dev ? 'npx next dev -p 3002' : 'npx next start -p 3002', 'http://localhost:3002'],
  ['03-student-portal', dev ? 'npx next dev -p 3003' : 'npx next start -p 3003', 'http://localhost:3003'],
];

if (!dev) {
  for (const [name] of apps.slice(1)) {
    console.log(`building ${name}...`);
    const result = spawnSync('npm run build --silent', { cwd: path.join(__dirname, name), shell: true, encoding: 'utf8' });
    if (result.status !== 0) {
      console.log(result.stdout + result.stderr);
      process.exit(1);
    }
  }
}

const colors = [33, 36, 35];
const children = apps.map(([name, command, url], i) => {
  const tag = `\x1b[${colors[i]}m[${name.slice(0, 2)}]\x1b[0m`;
  const child = spawn(command, { cwd: path.join(__dirname, name), shell: true });
  const print = (data) =>
    data
      .toString()
      .split('\n')
      .filter((line) => line.trim())
      .forEach((line) => console.log(`${tag} ${line}`));
  child.stdout.on('data', print);
  child.stderr.on('data', print);
  console.log(`${tag} ${name.padEnd(20)} ${url}`);
  return child;
});

process.on('SIGINT', () => {
  children.forEach((child) => child.kill());
  process.exit();
});
