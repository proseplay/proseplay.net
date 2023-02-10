import "./style.css";

import { initSlips, addSlip } from "./slips.js";
import { initShortcuts } from "./shortcuts.js";

const text = <HTMLElement>document.querySelector(".text");
const showRegexBtn = <HTMLInputElement>document.querySelector("#showRegexBtn");
const linkingBtn = <HTMLButtonElement>document.querySelector("#linkingBtn");
const resetLinksBtn = <HTMLButtonElement>document.querySelector("#resetLinksBtn");

const transitionTime = 15;

let isShowingRegex = false;

// linking
const links: HTMLElement[][] = [];
let isLinking = false;
let isMouseDown = false;

// variants
const addVariantBtn = document.querySelector("#addVariantBtn") as HTMLButtonElement;
let selectionRange: Range | null = null;
let mouseStartX = 0, mouseCurrentX = 0;
const inputTemp = (document.querySelector("#newChoiceInput") as HTMLInputElement).cloneNode(true) as HTMLInputElement;
inputTemp.remove();

// snapshots
const snapshotBtn = <HTMLButtonElement>document.querySelector("#snapshotBtn");
const snapshotTemp = (document.querySelector(".snapshot") as HTMLElement).cloneNode(true) as HTMLElement;
(document.querySelector(".snapshot") as HTMLElement).remove();
let snapshotNums: number[] = [];

document.addEventListener("DOMContentLoaded", init);

function init(): void {
  initSlips(addToLink, getLinks);
  initShortcuts();
  addEvents();
}

function addEvents(): void {
  // regex
  showRegexBtn.addEventListener("input", handleViewChange);
  handleViewChange();

  // linking
  linkingBtn.addEventListener("click", toggleLinking);

  // reset
  resetLinksBtn.addEventListener("click", resetLinks);

  // selections
  text.addEventListener("mousedown", handleMouseDown);
  text.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("selectionchange", handleSelection);

  // snapshots
  snapshotBtn.addEventListener("click", snapshot);

  // links
  const templates = document.querySelectorAll(".templates a") as NodeListOf<HTMLElement>;
  templates.forEach(temp => temp.addEventListener("click", loadTemp));
}

function handleMouseDown(e: MouseEvent): void {
  if ((e.target as HTMLElement).classList.contains("choice")) return;
  isMouseDown = true;
  mouseStartX = e.clientX;
  mouseCurrentX = mouseStartX;
}

function handleMouseMove(e: MouseEvent): void {
  if (!isMouseDown) return;
  mouseCurrentX = e.clientX;
}

function handleMouseUp(e: MouseEvent): void {
  if (!isMouseDown) return;
  isMouseDown = false;
}

function handleSelection(e: Event): void {
  const selection: Selection = document.getSelection() as Selection;
  const range: Range = selection.getRangeAt(0);
  if (rangeIsValid(range)) {
    selectionRange = range;
    addVariantBtn.style.top = `${((range.startContainer.parentElement as HTMLElement).closest(".line") as HTMLElement).offsetTop}px`;
    addVariantBtn.style.left = `${mouseStartX + (mouseCurrentX - mouseStartX) / 2}px`;
    addVariantBtn.classList.remove("hidden");

    addVariantBtn.addEventListener("click", addVariant);
  } else {
    selectionRange = null;
    addVariantBtn.classList.add("hidden");
  }
}

function rangeIsValid(range: Range): boolean {
  const startContainer = range.startContainer as Node;
  if (!(startContainer.parentElement as HTMLElement).classList.contains("line")) return false;

  const endContainer = range.endContainer;
  if (!(endContainer.parentElement as HTMLElement).classList.contains("line")) return false;
  if (startContainer !== endContainer) return false;

  const startOffset = range.startOffset;
  const endOffset = range.endOffset;
  const rangeVal = (startContainer.textContent as string).slice(startOffset, endOffset);
  if (!rangeVal) return false;

  return true;
}

function addVariant(): void {
  if (!selectionRange) return;
  const text = selectionRange.startContainer.textContent as string;
  const start = selectionRange.startOffset;
  const end = selectionRange.endOffset;
  const split = [
    text.slice(0, start),
    text.slice(start, end),
    text.slice(end, text.length),
  ];
  const prev = document.createTextNode(split[0]);
  split[0] = prev;
  const next = document.createTextNode(split[2]);
  split[2] = next;

  const slip = document.createElement("div");
  slip.classList.add("slip", "slip-words");
  const regex = document.createElement("div");
  regex.classList.add("regex");
  slip.appendChild(regex);
  const list = document.createElement("div");
  list.classList.add("list");
  slip.appendChild(list);
  const originalChoice = document.createElement("div");
  originalChoice.classList.add("choice", "current");
  originalChoice.innerText = split[1];
  list.appendChild(originalChoice);
  const newChoice = document.createElement("div");
  newChoice.classList.add("choice");
  // newChoice.innerText = "test";
  list.appendChild(newChoice);
  setTimeout(() => {
    originalChoice.classList.remove("current");
    newChoice.classList.add("current");
    list.style.top = `-${newChoice.offsetTop}px`;
    addSlip(slip);

    const newChoiceInput = inputTemp.cloneNode(true) as HTMLInputElement;
    (document.querySelector(".controls") as HTMLElement).appendChild(newChoiceInput);
    const originalBB = originalChoice.getBoundingClientRect();
    const newBB = newChoice.getBoundingClientRect();
    newChoiceInput.style.top = `${newBB.top}px`;
    newChoiceInput.style.left = `${newBB.left}px`;
    newChoiceInput.style.height = `${originalBB.height}px`;
    newChoiceInput.value = "";
    newChoiceInput.focus();
    newChoiceInput.addEventListener("keyup", e => { inputNewChoice(e, newChoiceInput, newChoice) });
  }, 10);
  split[1] = slip;

  handleViewChange();

  for (let i = 0; i < split.length; i++) {
    (selectionRange.startContainer.parentElement as HTMLElement).insertBefore(split[i], selectionRange.startContainer);
  }
  (selectionRange.startContainer as HTMLElement).remove();
}

function inputNewChoice(e: KeyboardEvent, newChoiceInput: HTMLInputElement, newChoice: HTMLElement): void {
  newChoiceInput.style.width = `${newChoiceInput.value.length * 20}px`;
  newChoice.innerText = newChoiceInput.value;
  handleViewChange();
  if (e.key === "Enter") {
    newChoiceInput.remove();
  }
}

function handleViewChange(): void {
  isShowingRegex = showRegexBtn.checked;
  text.classList.toggle("view-regex", isShowingRegex);
  text.classList.toggle("view-visual", !isShowingRegex);
  setTimeout(() => {
    const regexes = text.querySelectorAll(".regex") as NodeListOf<HTMLElement>;
    regexes.forEach(regex => {
      regex.style.display = isShowingRegex ? "inline-block" : "none";
    });

    const slips = text.querySelectorAll(".slip") as NodeListOf<HTMLElement>;
    slips.forEach(slip => {
      const current = slip.querySelector(".current") as HTMLElement;
      const slipType = slip.classList.contains("slip-words") ? "words" : "lines";
      if (isShowingRegex) {
        slip.style.width = "auto";
      } else {
        slip.style.width = `${current.offsetWidth}px`;
        if (slipType === "lines") {
          // slip.style.height = `${current.offsetHeight}px`;
          slip.style.height = `1.3em`;
        }
      }
    });
  }, transitionTime);
}

function toggleLinking(): void {
  isLinking = !isLinking;
  if (isLinking) {
    links.push([]);
  } else {
    if (links.length > 0) {
      resetLinksBtn.classList.remove("hidden");
      if (links[links.length - 1].length === 0) {
        links.splice(links[links.length - 1], 1);
      }
    }
  }

  // toggle body class
  document.body.classList.toggle("is-linking", isLinking);

  // toggle other controls
  showRegexBtn.disabled = isLinking;
  (document.querySelector("#generateBtn") as HTMLButtonElement).disabled = isLinking;
  resetLinksBtn.disabled = isLinking;
  snapshotBtn.disabled = isLinking;

  // change text on button
  linkingBtn.textContent = isLinking ? "Done" : "Create link";
}

function addToLink(slip: HTMLElement): void {
  links[links.length - 1].push(slip);
  
  // add superscript
  const sup = document.createElement("sup");
  sup.classList.add("link-ref");
  sup.textContent = `${links.length}`;
  slip.insertAdjacentElement("afterend", sup);
  
  // add data
  slip.setAttribute("data-link", `${links.length}`);
}

function getLinks(): HTMLElement[][] {
  return links;
}

function resetLinks(): void {
  text.querySelectorAll("sup").forEach(slip => slip.remove());
  text.querySelectorAll("[data-link]").forEach(slip => slip.removeAttribute("data-link"));
  links.splice(0, links.length);
  resetLinksBtn.classList.add("hidden");
}

function snapshot(): void {
  const lines = text.querySelectorAll(".line");

  const snapshot = snapshotTemp.cloneNode(true) as HTMLElement;

  const snapshotHeading = snapshot.querySelector(".snapshot-heading") as HTMLElement;
  let num: number;
  if (snapshotNums.length === 0) {
    num = 1;
  } else {
    num = snapshotNums[snapshotNums.length - 1] + 1;
  }
  snapshotNums.push(num);
  snapshotHeading.innerText = `Snapshot ${num}`;

  // const snapshotText = document.createElement("div");
  const snapshotText = snapshot.querySelector(".snapshot-text") as HTMLElement;
  let textContent = "";
  lines.forEach(line => {
    const nodes = line.childNodes;
    let lineText = "";
    nodes.forEach(node => {
      if (node.nodeName === "#text") {
        const nodeText = (node.textContent as string).trim();
        const punctuation = /[.,!?]/g;
        if (punctuation.test(nodeText.slice(0, 1))) {
          lineText = lineText.slice(0, lineText.length - 1);
        }
        lineText += nodeText;
      } else if (node.nodeName === "DIV") {
        const current = (node as HTMLElement).querySelector(".current") as HTMLElement;
        if (lineText !== "") {
          lineText += " ";
        }
        lineText += current.textContent + " ";
      }
    });
    textContent += lineText + "\n";
  });
  snapshotText.innerText = textContent;

  (snapshot.querySelector(".snapshot-clear") as HTMLElement).addEventListener("click", () => clearSnapshot(snapshot));

  (document.querySelector(".snapshots") as HTMLElement).appendChild(snapshot);
}

function clearSnapshot(snapshot: HTMLElement): void {
  snapshot.remove();
  console.log(document.querySelectorAll(".snapshot").length);
  if (document.querySelectorAll(".snapshot").length === 0) {
    snapshotNums = [];
  }
}

function loadTemp(e: MouseEvent): void {
  e.preventDefault();
  const linkText = (e.target as HTMLElement).innerText;
  const id = linkText.slice(1, linkText.length);
  const template = document.querySelector(`#${id}`) as HTMLElement;
  text.innerHTML = template.outerHTML;

  // clear snapshots
  (document.querySelector(".snapshots") as HTMLElement).innerHTML = "";
  snapshotNums = [];

  // re-initialise
  init();
}