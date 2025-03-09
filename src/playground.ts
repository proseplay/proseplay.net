import "./style.css";

import { ProsePlay } from "proseplay";
import LZString from 'lz-string';
import { getTextFromHash } from "./common";

const title = document.querySelector(".title") as HTMLElement;

const switcher = document.querySelector(".switcher") as HTMLElement;
const viewer = document.querySelector(".viewer") as HTMLElement;

const uploadBtn = document.querySelector("#uploadBtn") as HTMLButtonElement,
  saveBtn = document.querySelector("#saveBtn") as HTMLButtonElement;

const container = document.querySelector(".text") as HTMLElement,
  input = document.querySelector("#input") as HTMLTextAreaElement,
  submitBtn = document.querySelector("#submitBtn") as HTMLButtonElement;

const randomiseBtn = document.querySelector("#randomiseBtn") as HTMLButtonElement,
  detailBtn = document.querySelector("#detailBtn") as HTMLButtonElement,
  clearBtn = document.querySelector("#clearBtn") as HTMLButtonElement;

const focusBtn = document.querySelector("#focusBtn") as HTMLButtonElement,
  focusNote = document.querySelector(".focus-note") as HTMLElement,
  exitFocusBtn = document.querySelector("#exitFocusBtn") as HTMLButtonElement;
  
const helpBtn = document.querySelector("#helpBtn") as HTMLButtonElement;

const textContainer = document.querySelector(".text-container") as HTMLElement;

const snapshotBtn = document.querySelector("#snapshotBtn") as HTMLButtonElement,
  clearSnapshotsBtn = document.querySelector("#clearSnapshotsBtn") as HTMLButtonElement,
  snapshotsContainer = document.querySelector(".snapshots") as HTMLElement,
  snapshotTemplate = document.querySelector(".snapshot") as HTMLElement;
snapshotTemplate.remove();
const snapshots: HTMLElement[] = [];

const ppTitle = new ProsePlay(title),
  pp = new ProsePlay(container),
  ppSwitcher = new ProsePlay(switcher);

const shortcutsModal = document.querySelector(".shortcuts") as HTMLDialogElement;
shortcutsModal.addEventListener("click", e => {
  if (e.target === shortcutsModal) {
    shortcutsModal.close();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  ppTitle.parse(title.innerText);

  ppSwitcher.parse(switcher.innerText);
  ppSwitcher.setFunction("viewInput", viewInput);
  ppSwitcher.setFunction("viewOutput", viewOutput);
  ppSwitcher.setFunction("viewSnapshots", viewSnapshots);

  const loadBtns = document.querySelectorAll(".loadBtn") as NodeListOf<HTMLButtonElement>;
  loadBtns.forEach(btn => {
    btn.addEventListener("click", loadSample);
  });
  
  if (input.value === "") {
    const text = `in the (mist|missed) (see|sea)
(prey|pray) in the (morning|mourning)
for (words|worlds) that (exit|exist)
as (seep|sleep)`;
    setTextarea(text);
    setHash(text);
  }
  input.addEventListener("focus", () => {
    viewer.classList.add("focus--input");
    viewer.classList.remove("focus--output");
  });

  input.addEventListener("input", () => {
    setSaved(false);
  });

  input.addEventListener("change", () => {
    setHash(input.value);
  });

  uploadBtn.addEventListener("click", upload);
  saveBtn.addEventListener("click", save);

  const wrapTextInput = document.querySelector("#wrapText") as HTMLInputElement;
  wrapTextInput.addEventListener("change", toggleWrapText);
  
  submitBtn.addEventListener("click", submit);
  
  randomiseBtn.addEventListener("click", () => pp.randomise());
  randomiseBtn.addEventListener("pointerdown", () => randomiseBtn.classList.add("clicked"));
  randomiseBtn.addEventListener("pointerup", () => randomiseBtn.classList.remove("clicked"));
  detailBtn.addEventListener("click", toggleExpand);
  clearBtn.addEventListener("click", clear);
  
  focusBtn.addEventListener("click", focus);
  exitFocusBtn.addEventListener("click", unfocus);

  helpBtn.addEventListener("click", () => shortcutsModal.showModal());

  snapshotBtn.addEventListener("click", snapshot);
  clearSnapshotsBtn.addEventListener("click", clearSnapshots);
  
  window.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      input.blur();
      submit();
    } else {
      if (e.key === "Escape") {
        e.preventDefault();
        if (shortcutsModal.open) {
          shortcutsModal.close();
        } else if (input === document.activeElement) {
          input.blur();
        } else if (document.body.classList.contains("focus")) {
          unfocus();
        }
      }

      if (input === document.activeElement) return;

      if (e.key === "?") {
        e.preventDefault();
        shortcutsModal.showModal();
      }

      if (shortcutsModal.open) return;
      if (e.metaKey || e.shiftKey || e.ctrlKey || e.altKey) return;
      
      if (e.key === "r") {
        e.preventDefault();
        randomiseBtn.click();
      } else if (e.key === "e") {
        e.preventDefault();
        toggleExpand();
      } else if (e.key === "s") {
        e.preventDefault();
        snapshot();
      } else if (e.key === "f") {
        e.preventDefault();
        focus();
      } else if (e.key === "i") {
        e.preventDefault();
        input.focus();
      }
    }
  });

  window.addEventListener("hashchange", () => {
    readFromHash();
  });
});

function viewInput() {
  viewer.classList.add("view--input");
  viewer.classList.remove("view--output");
  viewer.classList.remove("view--snapshots");
}

function viewOutput() {
  submitBtn.click();
  viewer.classList.remove("view--input");
  viewer.classList.add("view--output");
  viewer.classList.remove("view--snapshots");
}

function viewSnapshots() {
  viewer.classList.remove("view--input");
  viewer.classList.remove("view--output");
  viewer.classList.add("view--snapshots");
}

function loadSample(e: Event) {
  const btn = e.currentTarget as HTMLButtonElement;
  fetch(`/samples/${btn.value}.txt`)
    .then(r => r.text())
    .then(text => {
      setTextarea(text);
      setHash(text);
    });
}

function upload() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".txt,text/plain";
  fileInput.addEventListener("input", () => {
    if (fileInput.files) {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const result = reader.result;
          if (result !== null) {
            const text = result as string;
            setTextarea(text);
            setHash(text);
          }
        }, false);
        reader.readAsText(file, "UTF-8");
      }
    }
  });
  fileInput.click();
}

function save() {
  const text = input.value;
  const blob = new Blob([text], { type: "text/plain;charset=UTF-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const title = "proseplay";
  a.download = `${title}.txt`;
  a.click();
}

function toggleWrapText() {
  input.classList.toggle("wrap");
}

function submit(e?: Event) {
  e?.preventDefault();
  pp.parse(input.value);
  ppSwitcher.slideWindow(0, 1);
  viewOutput();

  textContainer.classList.remove("empty");

  viewer.classList.remove("focus--input");
  viewer.classList.add("focus--output");
  
  detailBtn.disabled = false;
  randomiseBtn.disabled = false;
  clearBtn.disabled = false;
  snapshotBtn.disabled = false;
  focusBtn.disabled = false;

  snapshots.forEach(snapshot => snapshot.remove());
  snapshots.length = 0;
}

function toggleExpand() {
  pp.isExpanded ? pp.collapse() : pp.expand();
  (detailBtn.querySelector("span") as HTMLElement).innerText = pp.isExpanded ? "Collapse" : "Expand";
  detailBtn.classList.toggle("expand");
  detailBtn.classList.toggle("collapse");
  randomiseBtn.disabled = pp.isExpanded;
}

function clear() {
  pp.parse("");

  textContainer.classList.add("empty");

  viewer.classList.remove("focus--output");
  viewer.classList.add("focus--input");

  clearBtn.disabled = true;
  detailBtn.disabled = true;
  randomiseBtn.disabled = true;
  focusBtn.disabled = true;
  snapshotBtn.disabled = true;
}

function focus() {
  document.body.classList.add("focus");
  setTimeout(() => {
    document.querySelectorAll(".hidable").forEach(el => el.classList.add("invisible"));
  }, 500);

  viewer.classList.add("focusing");

  focusNote.classList.remove("invisible");
  focusNote.style.opacity = "1";
  exitFocusBtn.classList.remove("invisible");
  exitFocusBtn.style.opacity = "1";
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
  viewer.classList.remove("focusing");
  document.querySelectorAll(".hidable").forEach(el => el.classList.remove("invisible"));
  exitFocusBtn.classList.add("invisible");
}

function snapshot() {
  const snapshotHtml = snapshotTemplate.cloneNode(true) as HTMLElement;
  snapshotsContainer.appendChild(snapshotHtml);
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
    if (snapshots.length === 0) {
      clearSnapshotsBtn.disabled = true;
      snapshotsContainer.classList.add("empty");
    }
  });

  snapshotsContainer.classList.remove("empty");

  clearSnapshotsBtn.disabled = false;
}

function clearSnapshots() {
  snapshots.forEach(el => el.remove());
  snapshotsContainer.classList.add("empty");
  clearSnapshotsBtn.disabled = true;
  snapshots.length = 0;
}

function setTextarea(value: string) {
  input.value = value;
}

function setHash(value: string) {
  const compressed = LZString.compressToEncodedURIComponent(value);
  window.location.hash = compressed;
  setSaved(true);
}

function readFromHash() {
  const text = getTextFromHash();
  setTextarea(text);
}

function setSaved(saved: boolean) {
  const statusElement = document.querySelector(".status") as HTMLElement;
  statusElement.classList.toggle("saved", saved);
}