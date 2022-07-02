class Component {
  constructor() {
    this.parent = null;
  }

  SetParent(p) {
    this.parent = p;
  }

  InitComponent() {}
  Update(_) {}
}

export { Component };