import * as THREE from "./vendor/three/build/three.module.js";
import {SVGLoader} from "./vendor/three/examples/jsm/loaders/SVGLoader.js";

import {LoadingManager} from "./LoadingManager.js";
import {Entity} from "./Entity.js";


class GraphicEntity extends Entity {
  constructor(props) {
    super(props);
    this.load_svg(props);
  }

  load_svg(props) {
    const path = props.path;
    const svg_loader = new SVGLoader(LoadingManager.instance());
    svg_loader.load(path, (svg) => {
      const paths = svg.paths;
      const group = new THREE.Group();

      const background = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2, 1, 1),
          new THREE.MeshStandardMaterial({ color: 0xf1f1f1 })
      )
      // background.position.x = 249;
      // background.position.y = -249;
      // background.position.z = -1;
      group.add(background);

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const material = new THREE.MeshStandardMaterial({
          color: path.color,
          side: THREE.DoubleSide,
          depthWrite: false,
          transparent: true,
          opacity: props.opacity
        });

        const shapes = SVGLoader.createShapes(path);
        for (let j = 0; j < shapes.length; j++) {
          const shape = shapes[j];
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.x -= 0.8;
          mesh.position.y += 0.75;
          mesh.position.z += 0.01;
          mesh.rotation.x = Math.PI;
          mesh.scale.x = 0.1;
          mesh.scale.y = 0.1;
          mesh.scale.z = 0.1;
          group.add(mesh);
        }
      }

      this.object = group;
      this.object.position.copy(props.position);
      this.object.rotation.copy(props.rotation);
      this.object.scale.copy(props.scale);
      this.scene.add(this.object);
    });
  }
}

export { GraphicEntity };