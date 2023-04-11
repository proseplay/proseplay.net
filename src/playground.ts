import "./style.css";

import { ProsePlay } from "proseplay";

const title = document.querySelector(".title") as HTMLElement;

const container = document.querySelector(".text") as HTMLElement,
  input = document.querySelector("#input") as HTMLTextAreaElement,
  submitBtn = document.querySelector("#submitBtn") as HTMLButtonElement;

const randomiseBtn = document.querySelector("#randomiseBtn") as HTMLButtonElement,
  expandBtn = document.querySelector("#expandBtn") as HTMLButtonElement;

const focusBtn = document.querySelector("#focusBtn") as HTMLButtonElement,
  focusNote = document.querySelector(".focus-note") as HTMLElement;
  
const switcher = document.querySelector(".switcher") as HTMLElement;
const viewer = document.querySelector(".viewer") as HTMLElement;
  
const snapshotBtn = document.querySelector("#snapshotBtn") as HTMLButtonElement,
  snapshotContainer = document.querySelector(".snapshots") as HTMLElement,
  snapshotTemplate = document.querySelector(".snapshot") as HTMLElement;
snapshotTemplate.remove();
let snapshots: HTMLElement[] = [];

const ppTitle = new ProsePlay(title),
  pp = new ProsePlay(container),
  ppSwitcher = new ProsePlay(switcher);

document.addEventListener("DOMContentLoaded", () => {
  ppTitle.parse(title.innerText);

  ppSwitcher.parse(switcher.innerText);
  ppSwitcher.setFunction("viewInput", viewInput);
  ppSwitcher.setFunction("viewOutput", viewOutput);

  const loadBtns = document.querySelectorAll(".loadBtn") as NodeListOf<HTMLButtonElement>;
  loadBtns.forEach(btn => {
    btn.addEventListener("click", load);
  });
  
  input.value = `in the (mist|missed) (see|sea)
  (prey|pray) in the (morning|mourning)
  for (words|worlds) that (exit|exist)
  as (seep|sleep)`;
  
  submitBtn.addEventListener("click", submit);
  
  randomiseBtn.addEventListener("click", () => pp.randomise());
  
  expandBtn.addEventListener("click", toggleExpand);
  
  snapshotBtn.addEventListener("click", snapshot);
  
  focusBtn.addEventListener("click", focus);
  
  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && document.body.classList.contains("focus")) {
      unfocus();
    }
  });
});

function load(e: Event) {
  const btn = e.currentTarget as HTMLButtonElement;
  fetch(`/samples/${btn.value}.txt`)
    .then(r => r.text())
    .then(text => {
      input.value = text;
    });
}

function submit(e?: Event) {
  e?.preventDefault();
  pp.parse(input.value);
  ppSwitcher.slideWindow(0, 1);
  viewOutput();

  expandBtn.disabled = false;
  randomiseBtn.disabled = false;
  snapshotBtn.disabled = false;
  focusBtn.disabled = false;

  snapshots.forEach(snapshot => snapshot.remove());
  snapshots = [];
}

function toggleExpand() {
  pp.isExpanded ? pp.collapse() : pp.expand();
  expandBtn.innerText = pp.isExpanded ? "Collapse" : "Expand";
  randomiseBtn.disabled = pp.isExpanded;
}

function snapshot() {
  const snapshotHtml = snapshotTemplate.cloneNode(true) as HTMLElement;
  snapshotContainer.appendChild(snapshotHtml);
  snapshots.push(snapshotHtml);

  const snapshotHeading = snapshotHtml.querySelector(".snapshot--heading") as HTMLElement;
  snapshotHeading.innerText = `Snapshot ${snapshots.length}`;

  const snapshotText = snapshotHtml.querySelector(".snapshot--text") as HTMLElement;
  const text = pp.snapshot();
  snapshotText.innerText = text;

  const snapshotClear = snapshotHtml.querySelector(".snapshot--clear") as HTMLElement;
  snapshotClear.addEventListener("click", () => {
    snapshotHtml.remove();
    const index = snapshots.indexOf(snapshotHtml);
    snapshots.splice(index, 1);
    snapshots.forEach((otherSnap, i) => {
      (otherSnap.querySelector(".snapshot--heading") as HTMLElement).innerText = `Snapshot ${i + 1}`;
    });
  });
}

function focus() {
  document.body.classList.add("focus");
  setTimeout(() => {
    document.querySelectorAll(".hidable").forEach(el => el.classList.add("invisible"));
  }, 500);

  focusNote.classList.remove("invisible");
  focusNote.style.opacity = "1";
  setTimeout(() => {
    setTimeout(() => {
      focusNote.style.opacity = "0";
      setTimeout(() => {
        focusNote.classList.add("invisible");
      }, 500);
    }, 1000);
  }, 1000);
}

function unfocus() {
  document.body.classList.remove("focus");
  document.querySelectorAll(".hidable").forEach(el => el.classList.remove("invisible"));
}

function viewInput() {
  viewer.classList.add("view-input");
  viewer.classList.remove("view-output");
}

function viewOutput() {
  submitBtn.click();
  viewer.classList.add("view-output");
  viewer.classList.remove("view-input");
}