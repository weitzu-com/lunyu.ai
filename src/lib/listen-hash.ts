/** Shared fragment for passage-specific listen URLs: `#listen-{sentenceId}`. */

export function listenFragment(sentenceId: string) {
  return `listen-${sentenceId}`;
}

/** Read `#listen-{sentenceId}` from a location hash. */
export function parseListenHash(hash: string) {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  const prefix = "listen-";
  if (!value.startsWith(prefix)) return undefined;
  const sentenceId = value.slice(prefix.length);
  return sentenceId || undefined;
}
