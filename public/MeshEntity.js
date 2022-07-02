import * as THREE from "./vendor/three/build/three.module.js";
import {GLTFLoader} from "./vendor/three/examples/jsm/loaders/GLTFLoader.js";

import {LoadingManager} from "./LoadingManager.js";
import {Entity} from "./Entity.js";


class MeshEntity extends Entity {
  constructor(props) {
    super(props);
    this.load_mesh(props);
  }

  load_mesh(props) {
    const path = props.path;
    const gltf_loader = new GLTFLoader(LoadingManager.instance());
    gltf_loader.load(path, (gltf) => {
      const split = path.split('/');
      const name = split[split.length - 1].split('.')[0];
      this.name = name;

      gltf.scene.traverse(c => {
        let materials = c.material;
        if (!(c.material instanceof Array)) {
          materials = [c.material];
        }

        for (let m of materials) {
          if (m) {
            if (m.map) {
              if (m.name.startsWith('Optimized_Sprout_Material_1_0'))
                c.material = new THREE.MeshStandardMaterial({
                  color: m.color,
                  map: m.map,
                  depthTest: false,
                  transparent: true
                });
              else
                c.material = new THREE.MeshStandardMaterial({color: m.color, map: m.map});
            }
            else
              c.material = new THREE.MeshStandardMaterial({color: m.color});
          }
        }
      });

      this.object = gltf.scene;
      this.object.position.copy(props.position);
      this.object.rotation.copy(props.rotation);
      this.object.scale.copy(props.scale);
      this.scene.add(this.object);
    });
  }
}

export { MeshEntity };