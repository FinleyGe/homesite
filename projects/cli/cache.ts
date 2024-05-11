import fs from 'fs';

const cacheFile = 'cache.json';

export function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  } catch (e) {
    return {};
  }
}


export function saveToCache(key: string, value: any) {
  const cache = loadCache();
  cache[key] = value
  fs.writeFileSync(cacheFile, JSON.stringify(cache));
  return value;
}

export function loadFromCache(key: string) {
  return loadCache()[key];
}
