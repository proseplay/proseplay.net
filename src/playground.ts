import "./style.css";

import { ProsePlay } from "proseplay";

const title = document.querySelector(".title") as HTMLElement;
(new ProsePlay(title)).parse(title.innerText);

const container = document.querySelector(".text") as HTMLElement;
const pp = new ProsePlay(container);
const input = document.querySelector("#input") as HTMLTextAreaElement,
  submit = document.querySelector("#submitBtn") as HTMLButtonElement,
  generate = document.querySelector("#generateBtn") as HTMLButtonElement,
  expand = document.querySelector("#expandBtn") as HTMLButtonElement,
  snapshot = document.querySelector("#snapshotBtn") as HTMLButtonElement;

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
      });
  });
})

input.value = `in the (mist|missed) (see|sea)
(prey|pray) in the (morning|mourning)
for (words|worlds) that (exit|exist)
as (seep|sleep)`;

const ppSwitcher = new ProsePlay(document.querySelector(".switcher") as HTMLElement);
ppSwitcher.parse((document.querySelector(".switcher") as HTMLElement).innerText);
ppSwitcher.setFunction("viewInput", viewInput);
ppSwitcher.setFunction("viewOutput", viewOutput);

submit.addEventListener("click", e => {
  e.preventDefault();
  pp.parse(input.value);
  viewOutput();
  ppSwitcher.windows[0].slideTo(-ppSwitcher.windows[0].choices[1].offsetLeft + 7.2);

  expand.disabled = false;
  generate.disabled = false;
  snapshot.disabled = false;

  snapshots.forEach(snapshot => snapshot.remove());
  snapshots = [];
});

generate.addEventListener("click", () => pp.generate());

expand.addEventListener("click", () => {
  pp.isExpanded() ? pp.collapse() : pp.expand();
  expand.innerText = pp.isExpanded() ? "Collapse" : "Expand";
  generate.disabled = pp.isExpanded();
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

function viewInput() {
  (document.querySelector(".viewer") as HTMLElement).classList.add("view-input");
  (document.querySelector(".viewer") as HTMLElement).classList.remove("view-output");
}

function viewOutput() {
  submit.click();
  (document.querySelector(".viewer") as HTMLElement).classList.add("view-output");
  (document.querySelector(".viewer") as HTMLElement).classList.remove("view-input");
}