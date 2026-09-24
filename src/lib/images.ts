/** Public pages show the watermarked derivative. `/images/` stays the unmarked original. */
export function previewSrc(src: string) {
  return src.startsWith("/images/") ? `/previews/${src.slice("/images/".length)}` : src;
}

export function thumbSrc(src: string) {
  return src.startsWith("/images/") ? `/thumbs/${src.slice("/images/".length)}` : src;
}
