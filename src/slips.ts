const text = document.querySelector(".text") as HTMLElement;
const showRegexBtn = document.querySelector("#showRegexBtn") as HTMLInputElement;
const generateBtn = document.querySelector("#generateBtn") as HTMLButtonElement;

const TRANSITION_TIME = 15;

let isMouseDown = false;
let mouse = {"x": 0, "y": 0}
let draggedList: HTMLElement;

let addToLink: (slip: HTMLElement) => void, getLinks: () => HTMLElement[][]; // callbacks

function initSlips(_addToLink: (slip: HTMLElement) => void, _getLinks: () => HTMLElement[][]) {
  addToLink = _addToLink;
  getLinks = _getLinks;

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  const slips = document.querySelectorAll(".slip") as NodeListOf<HTMLElement>;
  slips.forEach(slip => {
    const currentChoice = slip.querySelector(".current") as HTMLElement;
    activateChoice(currentChoice);
  });

  generateBtn.addEventListener("click", generate);
}

function addSlip(slip: HTMLElement) {
  const currentChoice = slip.querySelector(".current") as HTMLElement;
  activateChoice(currentChoice);
}

function handleMouseOver(e: MouseEvent) {
  if (isLinking()) return;

  if (!isMouseDown) {
    const target = e.currentTarget as HTMLElement;
    target.closest(".slip")?.classList.toggle("hover", true);
    text.classList.toggle("hasHover", true);
  }
}

function handleMouseOut(e: MouseEvent) {
  if (isLinking()) return;

  if (!isMouseDown) {
    const target = e.currentTarget as HTMLElement;
    target.closest(".slip")?.classList.toggle("hover", false);
    text.classList.toggle("hasHover", false);
  }
}

function handleMouseDown(e: MouseEvent) {
  e.preventDefault();

  const target = e.currentTarget as HTMLElement,
    list = target.closest(".list") as HTMLElement,
    slip = target.closest(".slip") as HTMLElement;
  
  if (isLinking()) {
    if (getSlipLinks(slip).length === 0) {
      addToLink(slip);
    }
  } else {
    isMouseDown = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    draggedList = list;
    slip.classList.toggle("hover", true);
    getSlipLinks(slip).forEach(slip => {
      slip.classList.toggle("hover", true);
    });
  }
}

function handleMouseMove(e: MouseEvent) {
  if (isLinking()) return;
  if (!isMouseDown) return;
  
  e.preventDefault();

  let draggedListPos = parseInt(getComputedStyle(draggedList).getPropertyValue("top").replace("px", ""));
  draggedListPos -= (mouse.y - e.clientY);
  mouse.y = e.clientY;

  const draggedSlip = draggedList.closest(".slip") as HTMLElement;
  const slipsToMove = [draggedSlip, ...getSlipLinks(draggedSlip)];

  slipsToMove.forEach(slip => {
    const list = slip.querySelector(".list") as HTMLElement;
    list.style.top = `${draggedListPos}px`;

    const choices = slip.querySelectorAll(".choice") as NodeListOf<HTMLElement>;
    const targetChoice = getNearestChoice(choices, draggedListPos);
    if (!targetChoice) return;

    // remove stuff from current choice
    const currentChoice = slip.querySelector(".current") as HTMLElement;
    deactivateChoice(currentChoice);

    activateChoice(targetChoice);
    slip.style.width = `${targetChoice.offsetWidth}px`;
  });
}

function handleMouseUp(e: MouseEvent) {
  if (isLinking()) return;
  if (!isMouseDown) return;
  isMouseDown = false;
  
  let draggedListPos = parseInt(getComputedStyle(draggedList).getPropertyValue("top").replace("px", ""));

  const draggedSlip = draggedList.closest(".slip") as HTMLElement;
  const slipsToMove = [draggedSlip, ...getSlipLinks(draggedSlip)];
  slipsToMove.forEach(slip => {
    const list = slip.querySelector(".list") as HTMLElement;

    const listChoices = list.querySelectorAll(".choice") as NodeListOf<HTMLElement>;
    const targetChoice = getNearestChoice(listChoices, draggedListPos);
    if (!targetChoice) return;

    // set top
    list.style.top = `-${targetChoice.offsetTop}px`;

    // cancel hover
    slip.classList.toggle("hover", false);

    // remove stuff from current choice
    const currentChoice = list.querySelector(".current") as HTMLElement;
    deactivateChoice(currentChoice);

    // set new current choice
    activateChoice(targetChoice);

    // account for regex
    if (showRegexBtn.checked) {
      slip.style.width = "auto";
    }

    text.classList.toggle("hasHover", false);
  });
}

function getNearestChoice(listChoices: NodeListOf<HTMLElement>, draggedListPos: number): HTMLElement | null {
  let minDist = Infinity;
  let targetChoice: HTMLElement | null = null;
  listChoices.forEach(choice => {
    let dist: number;
    // if (slipType === "words") {
      dist = Math.abs(draggedListPos + (choice as HTMLElement).offsetTop);
    // } else {
    //   dist = Math.abs(draggedListPos + choice.offsetLeft);
    // }

    if (dist < minDist) {
      minDist = dist;
      targetChoice = choice;
    }
  });
  return targetChoice;
}

function generate() {
  const links = getLinks();
  const slips = document.querySelectorAll(".slip") as NodeListOf<HTMLElement>;
  const isolatedSlips = Array.from(slips).filter(slip => getSlipLinks(slip).length === 0).map(slip => [slip]);
  const groups = [...links, ...isolatedSlips];
  groups.forEach(group => {
    const choices = group[0].querySelectorAll(".choice");
    const choiceIndex = Math.floor(Math.random() * choices.length);
    group.forEach(slip => {
      const slipChoices = slip.querySelectorAll(".choice") as NodeListOf<HTMLElement>;
      slipChoices.forEach(choice => {
        deactivateChoice(choice);
      });
      const chosenChoice = slipChoices[choiceIndex] as HTMLElement;
      activateChoice(chosenChoice);

      const list = slip.querySelector(".list") as HTMLElement;
      list.style.transition = "top 0.15s ease-in-out, left 0.15s ease-in-out";
      setTimeout(() => list.style.transition = "", TRANSITION_TIME);
      list.style.top = `-${chosenChoice.offsetTop}px`;

      if (showRegexBtn.checked) {
        slip.style.width = "auto";
      } else {
        slip.style.width = `${chosenChoice.offsetWidth}px`;
      }
    });
  });
}

function isLinking(): boolean {
  return document.body.classList.contains("is-linking");
}

function getSlipLinks(slip: HTMLElement) {
  let returnLink: HTMLElement[] = [];
  getLinks().forEach(link => {
    if (link.includes(slip)) {
      returnLink = link;
    }
  });
  return returnLink;
}

function activateChoice(choice: HTMLElement) {
  choice.classList.toggle("current", true);
  choice.addEventListener("mouseover", handleMouseOver);
  choice.addEventListener("mouseout", handleMouseOut);
  choice.addEventListener("mousedown", handleMouseDown);
}

function deactivateChoice(choice: HTMLElement) {
  choice.classList.toggle("current", false);
  choice.removeEventListener("mouseover", handleMouseOver);
  choice.removeEventListener("mouseout", handleMouseOut);
  choice.removeEventListener("mousedown", handleMouseDown);
}

export { initSlips, addSlip }