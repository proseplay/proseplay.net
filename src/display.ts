import { ProsePlay } from "proseplay";
import { getHash, getTextFromHash } from "./common";

window.addEventListener("DOMContentLoaded", () => init());
window.addEventListener("keydown", handleKeydown);

const textArea = document.querySelector(".text") as HTMLElement;
const pp: ProsePlay = new ProsePlay(textArea);

const sourceAnchor = document.querySelector("#source-anchor") as HTMLAnchorElement;

const detailBtn = document.querySelector("#detailBtn") as HTMLButtonElement;
const randomiseBtn = document.querySelector("#randomiseBtn") as HTMLButtonElement;

randomiseBtn.addEventListener("click", () => pp.randomise());
randomiseBtn.addEventListener("pointerdown", () => randomiseBtn.classList.add("clicked"));
randomiseBtn.addEventListener("pointerup", () => randomiseBtn.classList.remove("clicked"));
detailBtn.addEventListener("click", toggleExpand);

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
  (detailBtn.querySelector("span") as HTMLElement).innerText = pp.isExpanded ? "Collapse" : "Expand";
  detailBtn.classList.toggle("expand");
  detailBtn.classList.toggle("collapse");
  randomiseBtn.disabled = pp.isExpanded;
}