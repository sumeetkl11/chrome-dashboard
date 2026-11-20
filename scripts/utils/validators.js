export function validateGitHubToken(token) {
  // Classic token: ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (40 chars after prefix)
  // Fine-grained token: github_pat_XXXXXXXXXXXX... (82 chars after prefix)
  return /^ghp_[a-zA-Z0-9]{36}$/.test(token) || /^github_pat_[a-zA-Z0-9_]{82}$/.test(token);
}

export function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateFolderName(name) {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= 50;
}

export function validateLinkName(name) {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
}

export function validateGistId(id) {
  return /^[a-f0-9]{32}$/.test(id);
}
