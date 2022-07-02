import {Entity} from "./Entity.js";

class Object3DEntity extends Entity {
  constructor(props) {
    super(props);
    this.object = props.object;
    this.object.position.copy(props.position);
    this.object.rotation.copy(props.rotation);
    this.object.scale.copy(props.scale);
    this.scene.add(this.object);
  }
}

export { Object3DEntity };