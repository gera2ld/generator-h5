export function buildURL({ path, query }) {
  const qs = query && Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&');
  return path + (qs ? `?${qs}` : '');
}
