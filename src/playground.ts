import "./style.css";

import { ProsePlay } from "./proseplay/proseplay";

(new ProsePlay(document.querySelector(".title") as HTMLElement)).parseText("(Prose|Puzzle)(Play|Poetry)");

const container = document.querySelector(".text") as HTMLElement;
const pp = new ProsePlay(container);
const input = document.querySelector("#input") as HTMLTextAreaElement,
  submit = document.querySelector("#submitBtn") as HTMLElement,
  generate = document.querySelector("#generateBtn") as HTMLElement,
  peek = document.querySelector("#peekBtn") as HTMLElement,
  snapshot = document.querySelector("#snapshotBtn") as HTMLElement;

const snapshotContainer = document.querySelector(".snapshots") as HTMLElement,
  snapshotTemplate = document.querySelector(".snapshot") as HTMLElement;
snapshotTemplate.remove();
let numSnapshots = 0;

input.value = `this is (my|your|our)[1]
very (lovely|cool|weird)[1]
(poem|experience)`;

submit.addEventListener("click", e => {
  e.preventDefault();
  pp.parseText(input.value);
});
submit.click();

generate.addEventListener("click", () => pp.generate());

peek.addEventListener("click", () => {
  pp.isPeeking() ? pp.hide() : pp.peek();
  peek.innerText = pp.isPeeking() ? "Hide" : "Peek";
});

snapshot.addEventListener("click", () => {
  numSnapshots++;

  let snapshotHtml = snapshotTemplate.cloneNode(true) as HTMLElement;
  snapshotContainer.appendChild(snapshotHtml);

  let snapshotHeading = snapshotHtml.querySelector(".snapshot--heading") as HTMLElement;
  snapshotHeading.innerText = `Snapshot ${numSnapshots}`;

  let snapshotText = snapshotHtml.querySelector(".snapshot--text") as HTMLElement;
  let text = pp.snapshot();
  snapshotText.innerText = text;
});