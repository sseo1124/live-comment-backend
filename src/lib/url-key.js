export function toUrlKey(raw) {
  const u = new URL(raw);
  const path = u.pathname.replace(/\/+$/, "") || "/";
  return `${u.origin}${path}`;
}
