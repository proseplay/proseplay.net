class Choice {
  static template: HTMLElement;
  el: HTMLElement;
  text: string;
  isCurrent: boolean;

  static {
    Choice.template = document.querySelector(".choice") as HTMLElement;
    Choice.template.remove();
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
}

export { Choice }