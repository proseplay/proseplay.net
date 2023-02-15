import "./style.css";

import { ProsePlay } from "./proseplay/proseplay";

const title = document.querySelector(".title") as HTMLElement;
(new ProsePlay(title)).parseText(title.innerText);

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
let snapshots: HTMLElement[] = [];

input.value = `in the (mist|missed) (see|sea)
(prey|pray) in the (morning|mourning)
for (words|worlds)[1] that (exit|exist)[1]
as (seep|sleep)`;

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
  let snapshotHtml = snapshotTemplate.cloneNode(true) as HTMLElement;
  snapshotContainer.appendChild(snapshotHtml);
  snapshots.push(snapshotHtml);

  let snapshotHeading = snapshotHtml.querySelector(".snapshot--heading") as HTMLElement;
  snapshotHeading.innerText = `Snapshot ${snapshots.length}`;

  let snapshotText = snapshotHtml.querySelector(".snapshot--text") as HTMLElement;
  let text = pp.snapshot();
  snapshotText.innerText = text;

  let snapshotClear = snapshotHtml.querySelector(".snapshot--clear") as HTMLElement;
  snapshotClear.addEventListener("click", () => {
    snapshotHtml.remove();
    let index = snapshots.indexOf(snapshotHtml);
    snapshots.splice(index, 1);
  });
});