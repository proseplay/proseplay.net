import { Choice } from "./choice";

const TRANSITION_TIME = 15;

class Slip {
  static template: HTMLElement;
  el: HTMLElement;
  listEl: HTMLElement;
  choices: Choice[];
  currentChoice: Choice | undefined;

  static {
    Slip.template = document.createElement("div");
    Slip.template.classList.add("slip", "slip-words");
  }

  constructor(parent: HTMLElement) {
    this.el = Slip.template.cloneNode(true) as HTMLElement;
    parent.appendChild(this.el);

    this.listEl = document.createElement("div");
    this.listEl.classList.add("list");
    this.el.append(this.listEl);

    this.choices = [];
  }

  addChoice(choice: Choice): void {
    this.choices.push(choice);
    this.listEl.appendChild(choice.el);
  }

  activateChoice(choice: Choice): void {
    this.currentChoice = choice;
    this.choices.forEach(otherChoice => otherChoice.deactivate());
    choice.activate();
    this.el.style.width = `${choice.el.offsetWidth}px`;
  }

  slideTo(yPos: number): void {
    this.listEl.style.top = `${yPos}px`;

    const targetChoice = this.getNearestChoice(yPos);
    if (!targetChoice) return;

    this.activateChoice(targetChoice);
  }

  getNearestChoice(yPos: number): Choice | null {
    let minDist = Infinity;
    let targetChoice: Choice | null = null;
    this.choices.forEach(choice => {
      let dist = Math.abs(yPos + choice.offsetTop);
      if (dist < minDist) {
        minDist = dist;
        targetChoice = choice;
      }
    });
    return targetChoice;
  }

  get top(): number {
    return parseInt(getComputedStyle(this.listEl).getPropertyValue("top").replace("px", ""));
  }

  hover(): void {
    this.el.classList.add("hover");
  }

  noHover(): void {
    this.el.classList.remove("hover");
  }

  random(): void {
    const randomIndex = Math.floor(Math.random() * this.choices.length);
    const choice = this.choices[randomIndex];
    this.activateChoice(choice);

    this.listEl.style.transition = "top 0.15s ease-in-out, left 0.15s ease-in-out";
    setTimeout(() => this.listEl.style.transition = "", TRANSITION_TIME);
    this.listEl.style.top = `-${choice.offsetTop}px`;
  }
}

export { Slip }