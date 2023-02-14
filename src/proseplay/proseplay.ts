import "./proseplay.css";

import { Slip } from "./slip";
import { Choice } from "./choice";

type Token = string | string[];
type TokenizedLine = Token[];
type TokenizedText = TokenizedLine[];

const lineTemplate = document.createElement("div");
lineTemplate.classList.add("proseplay-line");

class ProsePlay {
  private el: HTMLElement;
  private slips: Slip[];

  private mouse: {x: number, y: number};
  private isMouseDown: boolean;
  private draggedSlip: Slip | null;

  constructor(el: HTMLElement) {
    this.el = el;
    this.el.classList.add("proseplay")
    this.slips = [];
    
    this.mouse = {x: 0, y: 0};
    this.isMouseDown = false;
    this.draggedSlip = null;

    document.addEventListener("mousedown", this.handleMouseDown);
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  private static createInstance(): ProsePlay {
    const container = document.createElement("div");
    container.classList.add("proseplay");
    document.body.appendChild(container);
    const pp = new ProsePlay(container);
    return pp;
  }

  loadSample(name: "homophones" | "hypothetically" | "dickinson" | "carpenter"): ProsePlay {
    fetch(`/samples/${name}.txt`)
      .then(r => r.text())
      .then(text => this.parseText(text));
    return this;
  }

  static loadSample(name: "homophones" | "hypothetically" | "dickinson" | "carpenter"): ProsePlay {
    const pp = ProsePlay.createInstance();
    pp.loadSample(name);
    return pp;
  }

  parseText(str: string): ProsePlay {
    str = str.trim();
    console.log(str);
    let textTokens: TokenizedText = [];
    let lines = str.split("\n");
    lines.forEach(line => {
      const lineTokens: TokenizedLine = [];
      let m = line.matchAll(/\(([^(|)]+\|)([^(|)]+\|?)+\)/g);
      let currIndex = 0;
      for (const match of m) {
        const index = match.index as number;
        let isEscaped = line[index - 1] === "\\";
        if (isEscaped) {
          lineTokens.push(line.slice(currIndex, index - 1));
          lineTokens.push(line.slice(index, index + match[0].length));
        } else {
          let prevStr = line.slice(currIndex, index);
          lineTokens.push(prevStr);
          let split = match[0].split(/[(|)]/);
          split = split.filter(x => x);
          lineTokens.push(split);
        }
        currIndex = index + match[0].length;
      }
      if (currIndex < line.length) {
        lineTokens.push(line.slice(currIndex));
      }
      textTokens.push(lineTokens);
    });
    textTokens = textTokens.filter(x => x);
    console.log(textTokens);
  
    this.constructText(textTokens);

    return this;
  }

  static parseText(str: string): ProsePlay {
    const pp = ProsePlay.createInstance();
    pp.parseText(str);
    return pp;
  }
  
  private constructText(text: TokenizedText): void {
    this.el.innerHTML = "";
    text.forEach(line => {
      const lineEl = lineTemplate.cloneNode(true) as HTMLElement;
      this.el.appendChild(lineEl);
      line.forEach(token => {
        if (typeof token === "string") {
          lineEl.append(document.createTextNode(token));
        } else {
          const slip = new Slip(lineEl);
          this.slips.push(slip);
          token.forEach(str => slip.addChoice(new Choice(str)));
          slip.activateChoice(slip.choices[0]);
        }
      });
      if (line.length === 0) {
        lineEl.innerHTML = "&nbsp;";
      }
    });
  }

  generate() {
    this.slips.forEach(slip => slip.random());
    return this;
  }

  private handleMouseDown = (e: MouseEvent): void => {
    this.isMouseDown = true;
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    this.slips.forEach(slip => {
      if (slip.isDragged) {
        this.draggedSlip = slip;
      }
    });

    if (this.draggedSlip) {
      this.slips.forEach(slip => {
        slip.isHoverable = false;
      });
    }
  }

  private handleMouseMove = (e: MouseEvent): void => {
    e.preventDefault();

    if (!this.isMouseDown) {
      let hasHover = false;
      this.slips.forEach(slip => {
        if (slip.isHovered) {
          hasHover = true;
        }
      });
      this.el.classList.toggle("proseplay-has-hover", hasHover);
      return;
    }

    if (!this.draggedSlip) return;
    let draggedListPos = this.draggedSlip.top;
    draggedListPos -= (this.mouse.y - e.clientY);
    this.mouse.y = e.clientY;
    this.draggedSlip.slideTo(draggedListPos);
  }

  private handleMouseUp = (): void => {
    this.isMouseDown = false;
    this.el.classList.remove("proseplay-has-hover");
    this.slips.forEach(slip => slip.isHoverable = true);
    if (!this.draggedSlip) return;
    this.draggedSlip.handleMouseUp();
    this.draggedSlip = null;
  }
}

export { ProsePlay }