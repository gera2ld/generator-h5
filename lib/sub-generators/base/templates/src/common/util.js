export function loadQuery(search) {
  const qs = search[0] === '?' ? search.slice(1) : search;
  return qs
  .split('&')
  .filter(Boolean)
  .map(item => item.split('='))
  .reduce((map, [key, value]) => {
    map[decodeURIComponent(key)] = decodeURIComponent(value);
    return map;
  }, {});
}

export function buildURL({ path, query }) {
  const qs = query && Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&');
  return path + (qs ? `?${qs}` : '');
}
