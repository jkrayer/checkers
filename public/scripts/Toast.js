let id = 0;

class Toast {
  constructor(message, options) {
    const { el, time } = options;
    this.msg = message;
    this.id = `toast-${++id}`;
    this.parent = el;
    this.time = time;
    this.div = null;
    this.button = null;
  }

  _halfWidth() {
    return (this.div.getBoundingClientRect().width || 0) / 2;
  }

  _markUp() {
    this.div = document.createElement("DIV");
    this.button = document.createElement("BUTTON");
    this.button.setAttribute("type", "button");
    this.button.setAttribute("title", "Close");
    this.button.innerHTML = "&times;";
    this.div.setAttribute("id", this.id);
    this.div.setAttribute("class", "toast");
    this.div.innerText = this.msg;
    this.div.appendChild(this.button);

    this.parent.appendChild(this.div);
    this.div.setAttribute("style", `left: calc(50% - ${this._halfWidth()}px)`);
    setTimeout(() => this.div.classList.add("show"), 0);
  }

  _attachEvents() {
    this.button.addEventListener(
      "click",
      () => {
        this.div.classList.add("hide");
        setTimeout(() => this.div.remove(), 200);
      },
      {
        once: true,
      }
    );

    setTimeout(
      () => this.button.dispatchEvent(new MouseEvent("click")),
      this.time
    );
  }

  render() {
    this._markUp();
    this._attachEvents();
  }
}

const toast = (options) => {
  const opts = { ...options, el: document.body, time: 2000 };
  return (message) => new Toast(message, opts).render();
};
