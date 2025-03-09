import { ProsePlay } from "proseplay";
import { getHash, getTextFromHash } from "./common";

window.addEventListener("DOMContentLoaded", () => init());

const textArea = document.querySelector(".text") as HTMLElement;
const sourceAnchor = document.querySelector("#source-anchor") as HTMLAnchorElement;

function init() {
  const text = getTextFromHash();
  const pp = new ProsePlay(textArea);
  pp.parse(text);

  const hash = getHash();
  const sourceLink = `/playground/#${hash}`;
  sourceAnchor.href = sourceLink; 
}