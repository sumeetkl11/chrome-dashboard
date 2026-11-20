const ALLOWED_PROTOCOLS = ['http:', 'https:'];

export function sanitizeURL(url) {
  try {
    const parsed = new URL(url);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsed.href;
  } catch {
    // Try adding https://
    try {
      const withProtocol = `https://${url}`;
      const parsed = new URL(withProtocol);
      return parsed.href;
    } catch {
      return null;
    }
  }
}

export function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function sanitizeLinkName(name) {
  return sanitizeHTML(name.trim().slice(0, 100));
}

export function sanitizeFolderName(name) {
  return sanitizeHTML(name.trim().slice(0, 50));
}

// Remove potentially dangerous attributes from URLs
export function stripDangerousURL(url) {
  try {
    const parsed = new URL(url);
    // Remove javascript: and data: URLs
    if (['javascript:', 'data:', 'vbscript:'].includes(parsed.protocol)) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}
