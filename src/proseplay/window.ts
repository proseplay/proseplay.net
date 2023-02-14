import { Choice } from "./choice";

const TRANSITION_TIME = 15;

class Window {
  static template: HTMLElement;
  el: HTMLElement;
  listEl: HTMLElement;
  choices: Choice[];
  currentChoice: Choice | undefined;

  isHoverable: boolean;
  isHovered: boolean;
  isDragged: boolean;

  static {
    Window.template = document.createElement("div");
    Window.template.classList.add("proseplay-window");
  }

  constructor(parent: HTMLElement) {
    this.el = Window.template.cloneNode(true) as HTMLElement;
    parent.appendChild(this.el);
    this.el.addEventListener("mouseover", this.handleMouseOver);
    this.el.addEventListener("mousedown", this.handleMouseDown);
    this.el.addEventListener("mouseout", this.handleMouseOut);

    this.listEl = document.createElement("div");
    this.listEl.classList.add("proseplay-list");
    this.el.append(this.listEl);

    this.choices = [];

    this.isHoverable = true;
    this.isHovered = false;
    this.isDragged = false;
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

  random(): void {
    const randomIndex = Math.floor(Math.random() * this.choices.length);
    const choice = this.choices[randomIndex];
    this.activateChoice(choice);

    this.listEl.style.transition = "top 0.15s ease-in-out, left 0.15s ease-in-out";
    setTimeout(() => this.listEl.style.transition = "", TRANSITION_TIME);
    this.listEl.style.top = `-${choice.offsetTop}px`;
  }

  slideTo(yPos: number): void {
    this.listEl.style.top = `${yPos}px`;

    const targetChoice = this.getNearestChoice(yPos);
    if (!targetChoice) return;

    this.activateChoice(targetChoice);
  }

  private getNearestChoice(yPos: number): Choice | null {
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

  private snapToNearestChoice(): void {
    const choice = this.getNearestChoice(this.top);
    if (!choice) return;
    this.activateChoice(choice);
    this.listEl.style.top = `-${choice.offsetTop}px`;
  }

  get top(): number {
    return parseInt(getComputedStyle(this.listEl).getPropertyValue("top").replace("px", ""));
  }

  handleMouseOver = (e: MouseEvent): void => {
    if (!this.isHoverable) return;

    const target = e.target as HTMLElement;
    if (!target.classList.contains("proseplay-current")) return;

    this.isHovered = true;
    this.el.classList.add("proseplay-hover");
  }

  handleMouseDown = (e: MouseEvent): boolean => {
    e.preventDefault();

    if (!this.isHoverable) return false;

    this.isHovered = true;
    this.isDragged = true;

    return false;
  }

  handleMouseOut = (): void => {
    if (this.isDragged) return;
    this.isHovered = false;
    this.isDragged = false;
    this.el.classList.remove("proseplay-hover");
  }

  handleMouseUp = (e: MouseEvent): boolean => {
    e.preventDefault();
    
    this.snapToNearestChoice();
    this.isHovered = false;
    this.isDragged = false;
    this.el.classList.remove("proseplay-hover");
    return false;
  }
}

export { Window }