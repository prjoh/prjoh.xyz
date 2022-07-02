import * as THREE from "./vendor/three/build/three.module.js";
import {
  AnimationType,
  Easing,
  OneshotAnimation,
  ScrollAnimation,
  TransformKeyframe,
  HTMLOpacityKeyframe,
  MaterialOpacityKeyframe,
  MaterialColorKeyframe,
  SkyColorKeyframe,
} from "./Animator.js";

export const data = {
  shaders: {
    vs_sky:
        `varying vec3 vWorldPosition;

         void main() {
           vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
           vWorldPosition = worldPosition.xyz;

           gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
         }`,
    fs_sky:
        `uniform vec3 topColor;
       uniform vec3 bottomColor;
       uniform float offset;
       uniform float exponent;

       varying vec3 vWorldPosition;

       void main() {
         float h = normalize( vWorldPosition + offset ).y;
         gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
       }`
  },
  fonts: {
    gentilis_bold: "./fonts/gentilis_bold.typeface.json",
    gentilis_regular: "./fonts/gentilis_regular.typeface.json",
    helvetiker_bold: "./fonts/helvetiker_bold.typeface.json",
    helvetiker_regular: "./fonts/helvetiker_regular.typeface.json",
    optimer_bold: "./fonts/optimer_bold.typeface.json",
    optimer_regular: "./fonts/optimer_regular.typeface.json",
  },
  meshes: [
    /*
     * STATION #1
     */
    {
      path: "./models/myroom.gltf",
      interactable: false,
      project_group: false,
      position: new THREE.Vector3(6, 0.1, -30),
      rotation: new THREE.Euler(0, -Math.PI / 3, 0),
      scale: new THREE.Vector3(0.75, 0.75, 0.75)
    },
    {
      path: "./models/camera.gltf",
      interactable: true,
      project_group: false,
      position: new THREE.Vector3(4.5, 1.125, -32.1),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1.75, 1.75, 1.75)
    },
    {
      path: "./models/guitar.gltf",
      interactable: true,
      project_group: false,
      position: new THREE.Vector3(6, 0.1, -30),
      rotation: new THREE.Euler(0, -Math.PI / 3, 0),
      scale: new THREE.Vector3(0.75, 0.75, 0.75)
    },
    {
      path: "./models/n64.gltf",
      interactable: true,
      project_group: false,
      position: new THREE.Vector3(6, 0.1, -30),
      rotation: new THREE.Euler(0, -Math.PI / 3, 0),
      scale: new THREE.Vector3(0.75, 0.75, 0.75)
    },
    {
      path: "./models/pc.gltf",
      interactable: true,
      project_group: false,
      position: new THREE.Vector3(6, 0.1, -30),
      rotation: new THREE.Euler(0, -Math.PI / 3, 0),
      scale: new THREE.Vector3(0.75, 0.75, 0.75)
    },
    {
      path: "./models/records.gltf",
      interactable: true,
      project_group: false,
      position: new THREE.Vector3(6, 0.1, -30),
      rotation: new THREE.Euler(0, -Math.PI / 3, 0),
      scale: new THREE.Vector3(0.75, 0.75, 0.75)
    },
    /*
     * STATION #2
     */
    {
      path: "./models/mycobot.gltf",
      interactable: true,
      project_group: true,
      position: new THREE.Vector3(-7.5, -5.0, -49.0),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
      scale: new THREE.Vector3(1.0, 1.0, 1.0)
    },
    {
      path: "./models/vr.gltf",
      interactable: true,
      project_group: true,
      position: new THREE.Vector3(-7.5, -5.0, -49.0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1.0, 1.0, 1.0)
    },
    {
      path: "./models/nintendo_controller.gltf",
      interactable: true,
      project_group: true,
      position: new THREE.Vector3(-7.5, -5.0, -49.0),
      rotation: new THREE.Euler(Math.PI / 3, Math.PI / 5, -Math.PI / 5),
      scale: new THREE.Vector3(1.0, 1.0, 1.0)
    },
    {
      path: "./models/other.gltf",
      interactable: true,
      project_group: true,
      position: new THREE.Vector3(-7.5, -5.0, -49.0),
      rotation: new THREE.Euler(0, 1.4 * Math.PI, 0),
      scale: new THREE.Vector3(1.0, 1.0, 1.0)
    },
    /*
     * STATION #3
     */
    {
      path: "./models/sakura.gltf",
      interactable: false,
      project_group: false,
      position: new THREE.Vector3(3.5, 0.0, -76.0),
      rotation: new THREE.Euler(0, Math.PI / 4, 0),
      scale: new THREE.Vector3(0.75, 0.5, 0.75)
    },
    {
      path: "./models/sakura2.gltf",
      interactable: false,
      project_group: false,
      position: new THREE.Vector3(12.0, 0.0, -70.0),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0),
      scale: new THREE.Vector3(0.75, 0.6, 0.75)
    },
    {
      path: "./models/tori.gltf",
      interactable: false,
      project_group: false,
      position: new THREE.Vector3(11.0, 0.0, -79.0),
      rotation: new THREE.Euler(0, Math.PI / 3, 0),
      scale: new THREE.Vector3(0.75, 0.75, 0.75)
    },
    {
      path: "./models/rock1.gltf",
      interactable: false,
      project_group: false,
      position: new THREE.Vector3(10.0, 0.25, -74.0),
      rotation: new THREE.Euler(Math.PI / 2, 0, 0),
      scale: new THREE.Vector3(0.3, 0.3, 0.3)
    },
    {
      path: "./models/rock2.gltf",
      interactable: false,
      project_group: false,
      position: new THREE.Vector3(12.0, 0.5, -75.0),
      rotation: new THREE.Euler(0, Math.PI / 5, 0),
      scale: new THREE.Vector3(0.5, 0.5, 0.5)
    }
  ],
  text_groups: [
    {
      parameters: {
        height: 0.025,
        size: 0.3,
        curve_segments: 10,
        bevel: true,
        bevel_thickness: 0.025,
        bevel_size: 0.025,
        mirror: false,
      },
      font: "optimer_bold",
      // STYLETODO
      color1: 0xF1F1F1,
      color2: 0x0C1318,
      texts: [
        {
          text: "Working in ...",
          position: new THREE.Vector3(9.5, -0.5, -27.0),
          rotation: new THREE.Euler(0, -Math.PI / 3, 0),
          scale: new THREE.Vector3(1.0, 1.0, 1.0)
        },
        {
          text: "Computer Graphics",
          position: new THREE.Vector3(8.5, -0.5, -25.75),
          rotation: new THREE.Euler(0, -Math.PI / 3, 0),
          scale: new THREE.Vector3(1.0, 1.0, 1.0)
        },
        {
          text: "Game Development",
          position: new THREE.Vector3(7.75, -0.5, -25.25),
          rotation: new THREE.Euler(0, -Math.PI / 3, 0),
          scale: new THREE.Vector3(1.0, 1.0, 1.0)
        },
        {
          text: "Robotics",
          position: new THREE.Vector3(6.5, -0.5, -25.75),
          rotation: new THREE.Euler(0, -Math.PI / 3, 0),
          scale: new THREE.Vector3(1.0, 1.0, 1.0)
        },
        {
          text: "UX / UI",
          position: new THREE.Vector3(5.8, -0.5, -25.5),
          rotation: new THREE.Euler(0, -Math.PI / 3, 0),
          scale: new THREE.Vector3(1.0, 1.0, 1.0)
        },
      ]
    },
    {
      parameters: {
        height: 0.025,
        size: 0.3,
        curve_segments: 10,
        bevel: true,
        bevel_thickness: 0.025,
        bevel_size: 0.025,
        mirror: false,
      },
      font: "optimer_bold",
      // STYLETODO
      color1: 0xF1F1F1,
      color2: 0x0C1318,
      texts: [
        {
          text: "Current Location:",
          position: new THREE.Vector3(5.75, -0.5, -72.0),
          rotation: new THREE.Euler(-Math.PI / 4, 0, 0),
          scale: new THREE.Vector3(1.0, 1.0, 1.0)
        },
        {
          text: "Tokyo, Japan",
          position: new THREE.Vector3(5.75, -0.5, -71.0),
          rotation: new THREE.Euler(-Math.PI / 4, 0, 0),
          scale: new THREE.Vector3(1.0, 1.0, 1.0)
        },
      ]
    },
  ],
  graphics: [
    {
      path: "./img/bitbucket-icon.svg",
      interactable: true,
      position: new THREE.Vector3(0.0, 4.5, -124.99),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(0.65, 0.65, 0.65)
    },
    {
      path: "./img/cv-icon.svg",
      interactable: true,
      position: new THREE.Vector3(0.0, 4.5, -124.99),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(0.65, 0.65, 0.65)
    },
    {
      path: "./img/linkedin-icon.svg",
      interactable: true,
      position: new THREE.Vector3(0.0, 4.5, -124.99),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(0.65, 0.65, 0.65)
    },
    {
      path: "./img/youtube-icon.svg",
      interactable: true,
      position: new THREE.Vector3(0.0, 4.5, -124.99),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(0.65, 0.65, 0.65)
    },
    {
      path: "./img/wordpress-icon.svg",
      interactable: true,
      position: new THREE.Vector3(0.0, 4.5, -124.99),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(0.65, 0.65, 0.65)
    },
    {
      path: "./img/twitter-icon.svg",
      interactable: true,
      position: new THREE.Vector3(0.0, 4.5, -124.99),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(0.65, 0.65, 0.65)
    },
    // {
    //   path: "./img/itchio-icon.svg",
    //   interactable: true,
    //   position: new THREE.Vector3(0.0, 4.5, -124.99),
    //   rotation: new THREE.Euler(0, 0, 0),
    //   scale: new THREE.Vector3(0.65, 0.65, 0.65)
    // },
  ],
  scene_animation: [
    new ScrollAnimation(
        [
          new TransformKeyframe(
              "camera",
              new THREE.Vector3(0.0, 30.0, 25.0),
              new THREE.Quaternion(-0.54, 0.0, 0.0, 0.84),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "scroll_cube",
              new THREE.Vector3(0.0, 0.125, 0.0),
              new THREE.Quaternion(),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new HTMLOpacityKeyframe(
              "header",
              1.0,
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
        ],
        20
    ),
    new ScrollAnimation(
        [
          new TransformKeyframe(
              "camera",
              new THREE.Vector3(1.0, 17.46, 0.3),
              new THREE.Quaternion(-0.41, -0.17, -0.05, 0.89),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "scroll_cube",
              new THREE.Vector3(0.0, 0.125, -14.5),
              new THREE.Quaternion(),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "text_plane",
              new THREE.Vector3(8.5, 0.01, -25.75),
              new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0.0, -Math.PI / 3)),
              new THREE.Vector3(1.0, 0.0, 1.0)
          ),
          new HTMLOpacityKeyframe(
              "header",
              0.0,
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
          new MaterialColorKeyframe(
              "ground",
              // STYLETODO
              new THREE.Color(0xF1F1F1),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
          new MaterialColorKeyframe(
              "path",
              // STYLETODO
              new THREE.Color(0x000000),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
        ],
        20
    ),
    new ScrollAnimation(
        [
          new TransformKeyframe(
              "camera",
              new THREE.Vector3(1.97, 5.32, -23.6),
              new THREE.Quaternion(-0.27, -0.33, -0.1, 0.9),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "scroll_cube",
              new THREE.Vector3(0.0, 0.125, -29.0),
              new THREE.Quaternion(),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "text_plane",
              new THREE.Vector3(8.5, 0.01, -25.75),
              new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0.0, -Math.PI / 3)),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new MaterialColorKeyframe(
              "ground",
              // STYLETODO
              new THREE.Color(0x000102),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
          new MaterialColorKeyframe(
              "path",
              // STYLETODO
              new THREE.Color(0xF1F1F1),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
        ],
        20
    ),
    new OneshotAnimation(
        "text_group",
        AnimationType.POSITION_Y,
        [-0.5, -0.5, -0.5, -0.5, -0.5],
        [0.25, 0.25, 0.25, 0.25, 0.25],
        750,
        Easing.OUT_ELASTIC,
        true,
        100,
        100,
        Easing.LINEAR,
    ),
    new ScrollAnimation(
        [
          new TransformKeyframe(
              "camera",
              new THREE.Vector3(1.97, 5.32, -23.6),
              new THREE.Quaternion(-0.27, -0.33, -0.1, 0.9),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "scroll_cube",
              new THREE.Vector3(0.0, 0.125, -29.0),
              new THREE.Quaternion(),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new MaterialColorKeyframe(
              "ground",
              // STYLETODO
              new THREE.Color(0x000102),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
          new MaterialColorKeyframe(
              "path",
              // STYLETODO
              new THREE.Color(0xF1F1F1),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
        ],
        20
    ),
    new ScrollAnimation(
        [
          new TransformKeyframe(
              "camera",
              new THREE.Vector3(0.0, 2.43, -32.08),
              new THREE.Quaternion(0.0, 0.0, 0.0, 1.0),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "scroll_cube",
              new THREE.Vector3(0.0, 0.125, -40.0),
              new THREE.Quaternion(),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new MaterialColorKeyframe(
              "ground",
              // STYLETODO
              new THREE.Color(0x787878),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
          new MaterialColorKeyframe(
              "path",
              // STYLETODO
              new THREE.Color(0x787878),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
        ],
        20
    ),
    new ScrollAnimation(
        [
          new TransformKeyframe(
              "camera",
              new THREE.Vector3(0.0, 1.0, -40.0),
              new THREE.Quaternion(0.12, 0.24, -0.03, 0.96),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "scroll_cube",
              new THREE.Vector3(0.0, 0.125, -50.0),
              new THREE.Quaternion(),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "text_plane2",
              new THREE.Vector3(6.0, 0.01, -72.0),
              new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0.0, 0.0)),
              new THREE.Vector3(1.0, 0.0, 1.0)
          ),
          new SkyColorKeyframe(
              "sky",
              // STYLETODO
              new THREE.Color(0x16637B),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
          new MaterialColorKeyframe(
              "ground",
              // STYLETODO
              new THREE.Color(0xF1F1F1),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
          new MaterialColorKeyframe(
              "path",
              // STYLETODO
              new THREE.Color(0x000000),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
        ],
        20
    ),
    new OneshotAnimation(
        "project_group",
        AnimationType.POSITION,
        [[-7.5, -5.0, -49.0], [-7.5, -5.0, -49.0], [-7.5, -5.0, -49.0], [-7.5, -5.0, -49.0]],
        [[-4, 0.0, -48.0], [-6.0, 1.5, -47.0], [-7.5, 3.5, -46.0], [-8.5, 0.0, -45.0]],
        1500,
        Easing.OUT_ELASTIC,
        true,
        0,
        250,
        Easing.LINEAR,
    ),
    new ScrollAnimation(
        [
          new TransformKeyframe(
              "camera",
              new THREE.Vector3(0.0, 1.0, -40.0),
              new THREE.Quaternion(0.12, 0.24, -0.03, 0.96),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "scroll_cube",
              new THREE.Vector3(0.0, 0.125, -50.0),
              new THREE.Quaternion(),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "text_plane2",
              new THREE.Vector3(6.0, 0.01, -72.0),
              new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0.0, 0.0)),
              new THREE.Vector3(1.0, 0.0, 1.0)
          ),
          new SkyColorKeyframe(
              "sky",
              // STYLETODO
              new THREE.Color(0x16637B),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
        ],
        20
    ),
    new ScrollAnimation(
        [
          new TransformKeyframe(
              "camera",
              new THREE.Vector3(0.0, 7.0, -62.0),
              new THREE.Quaternion(-0.18, -0.23, -0.04, 0.96),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "scroll_cube",
              new THREE.Vector3(0.0, 0.125, -75.0),
              new THREE.Quaternion(),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "text_plane2",
              new THREE.Vector3(6.0, 0.01, -72.0),
              new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0.0, 0.0)),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new MaterialOpacityKeyframe(
              "contact_group",
              0.0,
              Easing.IN_EXPO,
              Easing.OUT_EXPO
          ),
          new SkyColorKeyframe(
              "sky",
              // STYLETODO
              new THREE.Color(0x750B0E),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
        ],
        20
    ),
    new OneshotAnimation(
        "text_group2",
        AnimationType.POSITION_Y,
        [-0.5, -0.5, -0.5, -0.5, -0.5],
        [0.25, 0.25, 0.25, 0.25, 0.25],
        1000,
        Easing.OUT_ELASTIC,
        true,
        100,
        100,
        Easing.LINEAR,
    ),
    new ScrollAnimation(
        [
          new TransformKeyframe(
              "camera",
              new THREE.Vector3(0.0, 7.0, -62.0),
              new THREE.Quaternion(-0.18, -0.23, -0.04, 0.96),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "scroll_cube",
              new THREE.Vector3(0.0, 0.125, -75.0),
              new THREE.Quaternion(),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new MaterialOpacityKeyframe(
              "contact_group",
              0.0,
              Easing.IN_EXPO,
              Easing.OUT_EXPO
          ),
          new SkyColorKeyframe(
              "sky",
              // STYLETODO
              new THREE.Color(0x750B0E),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
        ],
        20
    ),
    new ScrollAnimation(
        [
          new TransformKeyframe(
              "camera",
              new THREE.Vector3(0.0, 3.0, -117.0),
              new THREE.Quaternion(0.05, 0.0, 0.0, 1.0),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new TransformKeyframe(
              "scroll_cube",
              new THREE.Vector3(0.0, 0.125, -124.5),
              new THREE.Quaternion(),
              new THREE.Vector3(1.0, 1.0, 1.0)
          ),
          new MaterialOpacityKeyframe(
              "contact_group",
              1.0,
              Easing.IN_EXPO,
              Easing.OUT_EXPO
          ),
          new SkyColorKeyframe(
              "sky",
              // STYLETODO
              new THREE.Color(0x16637B),
              Easing.IN_CUBIC,
              Easing.OUT_CUBIC,
          ),
        ],
        20
    ),
    new OneshotAnimation(
        "contact_group",
        AnimationType.POSITION_XY,
        [[0.0, 4.5], [0.0, 4.5], [0.0, 4.5], [0.0, 4.5], [0.0, 4.5], [0.0, 4.5]],
        [[0.0, 6.5], [1.732, 3.5], [-1.732, 3.5], [-1.732, 5.5], [1.732, 5.5], [0.0, 2.5]],
        1000,
        Easing.OUT_ELASTIC,
        true,
        0,
        250,
        Easing.LINEAR,
    ),
    // TODO: This is a hack to not crash due to OneshotAnimation at the end.
    new ScrollAnimation(
        [],
        20
    ),
    new ScrollAnimation(
        [],
        20
    ),
  ],
}