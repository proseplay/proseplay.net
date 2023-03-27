import "./style.css";

import { ProsePlay } from "proseplay";

const title = document.querySelector(".title") as HTMLElement;
(new ProsePlay(title)).parse(title.innerText);

const container = document.querySelector(".text") as HTMLElement;
const pp = new ProsePlay(container);
pp.setFunction("turnGrey", turnGrey);
pp.setFunction("turnBlue", turnBlue);
const input = document.querySelector("#input") as HTMLTextAreaElement,
  submit = document.querySelector("#submitBtn") as HTMLElement,
  generate = document.querySelector("#generateBtn") as HTMLElement,
  expand = document.querySelector("#expandBtn") as HTMLElement,
  snapshot = document.querySelector("#snapshotBtn") as HTMLElement;

const snapshotContainer = document.querySelector(".snapshots") as HTMLElement,
  snapshotTemplate = document.querySelector(".snapshot") as HTMLElement;
snapshotTemplate.remove();
let snapshots: HTMLElement[] = [];

const loadBtns = document.querySelectorAll(".loadBtn") as NodeListOf<HTMLButtonElement>;
loadBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    fetch(`/samples/${btn.value}.txt`)
      .then(r => r.text())
      .then(text => {
        input.value = text;
        submit.click();
      });
  });
})

input.value = `in the (mist->turnGrey|missed->turnBlue) (see|sea)
(prey|pray) in the (morning|mourning)
for (words|worlds) that (exit|exist)
as (seep|sleep)`;

submit.addEventListener("click", e => {
  e.preventDefault();
  pp.parse(input.value);
});
submit.click();

generate.addEventListener("click", () => pp.generate());

expand.addEventListener("click", () => {
  pp.isExpanded() ? pp.collapse() : pp.expand();
  expand.innerText = pp.isExpanded() ? "Hide" : "Expand";
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

function turnGrey() {
  document.body.classList.remove("blue");
  document.body.classList.add("grey");
}

function turnBlue() {
  document.body.classList.remove("grey");
  document.body.classList.add("blue");
}