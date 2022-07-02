import {Entity} from "./Entity.js";
import {data} from "./data.js";
import {TextGeometry} from "./vendor/three/examples/jsm/geometries/TextGeometry.js";
import * as THREE from "./vendor/three/build/three.module.js";
import {FontLoader} from "./vendor/three/examples/jsm/loaders/FontLoader.js";
import {LoadingManager} from "./LoadingManager.js";

let fonts = {};

class TextEntity extends Entity {
  constructor(props) {
    super(props);
    if (props.font in fonts)
      this.create_text_mesh(fonts[props.font], props);
    else
      this.load_font(props.font, props);
  }

  load_font(font_name, props)
  {
    const font_loader = new FontLoader(LoadingManager.instance());
    font_loader.load(data.fonts[font_name], (font) => {
      fonts[font_name] = font;
      this.create_text_mesh(font, props);
    });
  }

  create_text_mesh(font, props) {
    let textGeo = new TextGeometry( props.text, {
      font: font,
      size: props.parameters.size,
      height: props.parameters.height,
      curveSegments: props.parameters.curve_segments,
      bevelEnabled: props.parameters.bevel,
      bevelThickness: props.parameters.bevel_thickness,
      bevelSize: props.parameters.bevel_size,
    });
    textGeo.computeBoundingBox();

    const center_offset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    let materials = [
      // new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true, transparent: true, opacity: 0.1 } ), // front
      // new THREE.MeshPhongMaterial( { color: 0xffffff, transparent: true, opacity: 0.1  } ) // side
      new THREE.MeshBasicMaterial( { color: props.color1 } ), // front
      new THREE.MeshBasicMaterial( { color: props.color2 } ) // side
    ];
    let textMesh1 = new THREE.Mesh( textGeo, materials );
    textMesh1.position.x = center_offset;

    let group = new THREE.Group();
    group.position.copy(props.position);
    group.rotation.copy(props.rotation);
    group.scale.copy(props.scale);
    group.add(textMesh1);

    if (props.parameters.mirror) {
      let textMesh2 = new THREE.Mesh( textGeo, materials );

      textMesh2.position.x = center_offset;
      textMesh2.position.z = props.parameters.height;

      textMesh2.rotation.x = Math.PI;
      textMesh2.rotation.y = Math.PI * 2;

      group.add(textMesh2);
    }

    this.object = group;
    this.scene.add(this.object);
  }
}

export { TextEntity };