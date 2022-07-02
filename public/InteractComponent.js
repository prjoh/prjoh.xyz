import {Component} from "./Component.js";

class InteractComponent extends Component {
  constructor() {
    super();
  }

  InitComponent() {
    this.parent.RegisterHandler("Select", (msg) => this.OnSelected(msg));
    this.parent.RegisterHandler("Unselect", (msg) => this.OnUnselect(msg));
  }

  OnSelected(msg) {
    this.parent.object.traverse(c => {
      if (c.material)
      {
        c.originalHex = c.material.emissive.getHex();
        c.material.emissive.setHex(0x00637b);
      }
    });
  }

  OnUnselect(msg) {
    this.parent.object.traverse(c => {
      if (c.material)
        c.material.emissive.setHex(c.originalHex);
    });
  }
}

export { InteractComponent };