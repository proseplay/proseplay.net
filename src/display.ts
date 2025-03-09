import { ProsePlay } from "proseplay";
import { getHash, getTextFromHash } from "./common";

window.addEventListener("DOMContentLoaded", () => init());
window.addEventListener("keydown", handleKeydown);

const textArea = document.querySelector(".text") as HTMLElement;
const sourceAnchor = document.querySelector("#source-anchor") as HTMLAnchorElement;

const pp: ProsePlay = new ProsePlay(textArea);

function init() {
  const text = getTextFromHash();
  pp.parse(text);

  const hash = getHash();
  const sourceLink = `/playground/#${hash}`;
  sourceAnchor.href = sourceLink; 
}

function handleKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case "r": {
      e.preventDefault();
      randomise();
      break;
    }
    case "e": {
      e.preventDefault();
      toggleExpand();
      break;
    }
  }
}

function randomise() {
  pp.randomise();
}

function toggleExpand() {
  pp.isExpanded ? pp.collapse() : pp.expand();
}