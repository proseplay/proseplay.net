import LZString from 'lz-string';

export function getHash(): string {
  const hash = window.location.hash.replace("#", "");
  return hash;
}

export function getTextFromHash(): string {
  const hash = window.location.hash.replace("#", "");
  const decompressed = LZString.decompressFromEncodedURIComponent(hash);
  return decompressed;
}