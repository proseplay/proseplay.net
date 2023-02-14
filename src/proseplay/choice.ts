class Choice {
  static template: HTMLElement;
  el: HTMLElement;
  text: string;
  isCurrent: boolean;

  static {
    Choice.template = document.createElement("div");
    Choice.template.classList.add("choice");
  }

  constructor(text: string) {
    this.text = text;
    this.isCurrent = false;

    this.el = Choice.template.cloneNode(true) as HTMLElement;
    this.el.innerText = text;
  }

  activate() {
    this.isCurrent = true;
    this.el.classList.add("current");
  }
  
  deactivate() {
    this.isCurrent = false;
    this.el.classList.remove("current");
  }

  get offsetTop(): number {
    return this.el.offsetTop;
  }
}

export { Choice }