// /stress/utils.js
import fs from 'fs';

export function loadProfile(name) {
  const path = `./stress/profiles/${name}.json`;
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}
