
let ids = 0;
function GenerateName()
{
  ids += 1;
  return '__entity__' + ids;
}

class Entity {
  constructor(props) {
    this.scene = props.scene;
    this.object = null;
    this.name = props.name ? props.name : GenerateName();
    this.components = {};
    this.handlers = {};
  }

  AddComponent(c) {
    c.SetParent(this);
    this.components[c.constructor.name] = c;

    c.InitComponent();
  }

  RegisterHandler(topic, handler) {
    if (!(topic in this.handlers))
      this.handlers[topic] = [];

    this.handlers[topic].push(handler);
  }

  Broadcast(topic, msg) {
    if (!(topic in this.handlers))
      return;

    for (let handler of this.handlers[topic])
      handler(msg);
  }

  GetComponent(n) {
    return this.components[n];
  }

  Update(timeElapsed) {
    for (let k in this.components)
      this.components[k].Update(timeElapsed);
  }
}

export { Entity };