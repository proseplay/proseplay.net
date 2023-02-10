import { Choice } from "./choice";

class Slip {
  static template: HTMLElement;
  el: HTMLElement;
  list: HTMLElement;
  choices: Choice[];
  currentChoice: Choice | undefined;

  static {
    Slip.template = document.querySelector(".slip") as HTMLElement;
    Slip.template.remove();
  }

  constructor(parent: HTMLElement) {
    this.el = Slip.template.cloneNode(true) as HTMLElement;
    parent.appendChild(this.el);

    this.list = document.createElement("div");
    this.list.classList.add("list");
    this.el.append(this.list);

    this.choices = [];
  }

  addChoice(choice: Choice): void {
    this.choices.push(choice);
    this.list.appendChild(choice.el);
  }

  activateChoice(choice: Choice): void {
    this.currentChoice = choice;
    this.choices.forEach(otherChoice => otherChoice.deactivate());
    choice.activate();
    this.el.style.width = `${choice.el.offsetWidth}px`;
  }
}

export { Slip }