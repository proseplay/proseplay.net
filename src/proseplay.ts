import "./style.css";

import { Slip } from "./slip";
import { Choice } from "./choice";

type Token = string | string[];
type TokenizedLine = Token[];
type TokenizedText = TokenizedLine[];

const lineTemplate = document.createElement("div");
lineTemplate.classList.add("line");

class ProsePlay {
  private el: HTMLElement;
  private slips: Slip[];

  private mouse: {x: number, y: number};
  private draggedSlip: Slip | null;

  constructor(el: HTMLElement) {
    this.el = el;
    this.slips = [];

    this.mouse = {x: 0, y: 0};
    this.draggedSlip = null;
    
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  loadSample(name: "homophones" | "hypothetically" | "dickinson" | "carpenter"): void {
    fetch(`/samples/${name}.txt`)
      .then(r => r.text())
      .then(text => this.parseText(text));
  }

  parseText(str: string): void {
    console.log(str);
    let textTokens: TokenizedText = [];
    let lines = str.split("\n");
    lines.forEach(line => {
      const lineTokens: TokenizedLine = [];
      let m = line.matchAll(/\(([^(|)]+\|?)+\)/g);
      let currIndex = 0;
      for (const match of m) {
        let prevStr = line.slice(currIndex, match.index);
        lineTokens.push(prevStr);
        let split = match[0].split(/[(|)]/).filter(x => x);
        lineTokens.push(split);
        currIndex = (match.index as number) + match[0].length;
      }
      if (currIndex < line.length - 1) {
        lineTokens.push(line.slice(currIndex));
      }
      textTokens.push(lineTokens);
    });
    textTokens = textTokens.filter(x => x);
    console.log(textTokens);
  
    this.constructText(textTokens);
  }
  
  constructText(text: TokenizedText): void {
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

  handleMouseMove(e: MouseEvent): void {
    if (!this.draggedSlip) return;
    
    e.preventDefault();
  
    let draggedSlipPos = this.draggedSlip.top;
    draggedSlipPos -= (this.mouse.y - e.clientY);
    this.mouse.y = e.clientY;
    this.draggedSlip.slideTo(draggedSlipPos);
  }
  
  handleMouseUp(e: MouseEvent): void {
    if (!this.draggedSlip) return;

    const draggedSlipPos = this.draggedSlip.top;
    this.draggedSlip.slideTo(draggedSlipPos);

    // cancel hover
    this.draggedSlip.noHover();
    this.el.classList.toggle("hasHover", false);
  }

  generate() {
    this.slips.forEach(slip => slip.random());
  }
}

export { ProsePlay }