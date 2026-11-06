// Narrow validation for user-configured checkout and email links.
// This does not replace publisher/provider, affiliate, or privacy approval.
export function safeExternalUrl(value) {
  if (typeof value !== 'string' || !value || value.trim() !== value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) return null;
    if (host === '127.0.0.1' || host === '0.0.0.0' || host === '[::1]') return null;
    return url.href;
  } catch {
    return null;
  }
}
