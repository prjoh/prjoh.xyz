import * as THREE from './vendor/three/build/three.module.js'
import Stats from './stats.js';

import { data } from "./data.js";
import { LoadingManager } from "./LoadingManager.js";
import { MeshEntity } from "./MeshEntity.js";
import { GraphicEntity } from "./GraphicEntity.js";
import { InteractComponent } from "./InteractComponent.js";
import { Animator } from "./Animator.js";
import { TextEntity } from "./TextEntity.js";
import {Object3DEntity} from "./Object3DEntity.js";
import {OnClickOpenURLComponent, OnClickSoundComponent} from "./OnClickComponent.js";


/*
 *  DEBUG STUFF
 */

// // Performance metrics
// const canvas_parent = document.getElementById('scene');
// const stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// canvas_parent.appendChild(stats.dom)


/*
 * IMPORTANT STUFF
 */

// Check for platform
let hasTouchScreen = false;
if ("maxTouchPoints" in navigator) {
  hasTouchScreen = navigator.maxTouchPoints > 0;
} else if ("msMaxTouchPoints" in navigator) {
  hasTouchScreen = navigator.msMaxTouchPoints > 0;
} else {
  var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
  if (mQ && mQ.media === "(pointer:coarse)") {
    hasTouchScreen = !!mQ.matches;
  } else if ('orientation' in window) {
    hasTouchScreen = true; // deprecated, but good fallback
  } else {
    // Only as a last resort, fall back to user agent sniffing
    var UA = navigator.userAgent;
    hasTouchScreen = (
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
    );
  }
}
console.log("Is Mobile: " + hasTouchScreen);


if (hasTouchScreen)
{
  function updateDeviceOrientationHint(orientationQuery, orientationHint) {
    const isHorizontal = orientationQuery.matches;

    if (isHorizontal)
    {
      orientationHint.classList.add('hidden');
      on_window_resize();
    }
    else
      orientationHint.classList.remove('hidden');

    console.log("Device orientation is " + (isHorizontal ? 'horizontal' : 'vertical'));
  }

  const orientationHint = document.getElementById("device-orientation-hint");
  orientationHint.style.display = 'flex';

  const orientationQuery = window.matchMedia("(orientation:landscape)");
  updateDeviceOrientationHint(orientationQuery, orientationHint);

  orientationQuery.addEventListener('change', () => {
    updateDeviceOrientationHint(orientationQuery, orientationHint)
  });
}

// Loading manager
LoadingManager.init(() => {
  renderer.render(scene, camera); // Set inital state of scene
  set_event_handlers();
  set_request_update(true);
});

// Event handlers
function set_event_handlers() {
  window.onfocus = (event) => { set_request_update(true); };
  window.onblur = (event) => { set_request_update(false); };
  window.onresize = (event) => { on_window_resize(); };

  if (hasTouchScreen)
  {
    document.addEventListener('touchstart', on_touch_move, false);
    document.addEventListener('touchmove', on_touch_move, false);
    document.addEventListener('touchend', on_mouse_down, false);
  }
  else
  {
    document.onmousemove = (event) => { on_mouse_move(event); };  // TODO: Platform dependent
    document.onmousedown = (event) => { on_mouse_down(event); };  // TODO: Platform dependent
  }
  // document.onkeydown = (event) => { on_key_down(event); };
  // document.onkeyup = (event) => { on_key_up(event); };
  // content_button.onclick = () => { on_content_button_clicked(); };
  // content_button.onmouseenter = (event) => { content_button.classList.replace('active', 'hover') };
  // content_button.onmouseleave = (event) => { content_button.classList.replace('hover', 'active') };
  // document.onpointerlockchange = (event) => { on_pointer_lock_change() };
  // renderer.domElement.onclick = (event) => {
  //   renderer.domElement.requestPointerLock().catch(() => {
  //     setTimeout(() => { renderer.domElement.requestPointerLock(); }, lock_timeout);
  //   });
  // };
}

// TODO: Platform dependent
function set_content_button_handlers() {
  if (content_button === null)
    return;

  content_button.onclick = () => { on_content_button_clicked(); };
  content_button.onmouseenter = (event) => { content_button.classList.replace('active', 'hover') };
  content_button.onmouseleave = (event) => { content_button.classList.replace('hover', 'active') };
}

// TODO: Platform dependent
function unset_content_button_handlers() {
  if (content_button === null)
    return;

  content_button.onclick = null;
  content_button.onmouseenter = null;
  content_button.onmouseleave = null;
}

// Overlay canvas
// const overlay_canvas_container = document.getElementById('overlay-canvas-container')
// const overlay_canvas = document.getElementById('overlay-canvas-container2')


// Renderer, camera setup
const canvas = document.getElementById('scene-canvas');
const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
  antialias: true,
});
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
canvas.appendChild(renderer.domElement);

const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 1.0;
const far = 1000.0;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 30, 25);
camera.setRotationFromQuaternion(new THREE.Quaternion(-0.54, 0.0, 0.0, 0.84));
const listener = new THREE.AudioListener();
camera.add(listener);


// Scene setup
const header = document.getElementById('app-header');
let content_button = null;
// const content_button = document.getElementById('content-button');
const content_container = document.getElementById('content-container');
const content = {
  mycobot: document.getElementById('content-robot'),
  vr: document.getElementById('content-vr'),
  nintendo_controller: document.getElementById('content-games'),
  other: document.getElementById('content-other'),
}
let scroll_cube = null;
let ground = null;
let text_plane, text_plane2 = null;
let path = null;
let sky = null;
let text_group = [];
let text_group2 = [];
let contact_group = [];
let interactables = [];
let project_group = [];
const scene = new THREE.Scene();
function init_scene() {
  // STYLETODO
  scene.background = new THREE.Color().setHex(0xF1F1F1);
  // scene.fog = new THREE.Fog( scene.background, 1, 100 );
  scene.fog = new THREE.FogExp2(scene.background, 0.0125);

  // STYLETODO
  const hemiLight = new THREE.HemisphereLight( 0xE9D8A6, 0xF1F1F1, 0.7 );
  scene.add( hemiLight );

  // STYLETODO
  const dirLight = new THREE.DirectionalLight( 0xE9D8A6, 1.0 );
  dirLight.position.set( -1, 1.75, 1 );
  scene.add( dirLight );
  // const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
  // scene.add( dirLightHelper );

  // Room lighting
  // TODO: Make pingpong effect for intensity
  const room_light_1 = new THREE.PointLight( 0x00ff00, 3, 3 );
  room_light_1.position.set(7.5, 1, -29);
  scene.add(room_light_1);
  const room_light_2 = new THREE.PointLight( 0x0055ff, 5, 3 );
  room_light_2.position.set(6, 2, -31.5);
  scene.add(room_light_2);
  // scene.add( new THREE.PointLightHelper( room_light_2, 1 ) );

  // CREATE SKY
  const uniforms = {
    // STYLETODO
    "topColor": { value: new THREE.Color().setHex(0x16637B) },//{ value: new THREE.Color().setHex(0x750B0E) },
    "bottomColor": { value: new THREE.Color().copy(scene.fog.color) },
    "offset": { value: 0 },
    "exponent": { value: 0.8 }
  };
  const skyGeo = new THREE.SphereBufferGeometry(300, 32, 16);
  const skyMat = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: data.shaders.vs_sky,
    fragmentShader: data.shaders.fs_sky,
    side: THREE.BackSide
  } );
  sky = new THREE.Mesh( skyGeo, skyMat );
  scene.add( sky );

  ground = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 300, 10, 10),
      // STYLETODO
      new THREE.MeshStandardMaterial({ color: new THREE.Color(0xF1F1F1) })
  );
  // plane.castShadow = false;
  // plane.receiveShadow = true;
  ground.position.z = -100;
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const circle_geometry = new THREE.CircleGeometry( 2.0, 32 );
  const circle_geometry2 = new THREE.CircleGeometry( 2.2, 32 );
  // STYLETODO
  const path_material = new THREE.MeshStandardMaterial( { color: 0x000000 } );//{ color: 0x16637B } );
  const path_material2 = new THREE.MeshStandardMaterial( { color: 0x000000 } );//{ color: 0x00070A } );
  const start_circle = new THREE.Mesh( circle_geometry, path_material );
  const start_circle2 = new THREE.Mesh( circle_geometry2, path_material2 );
  const end_circle = new THREE.Mesh( circle_geometry, path_material );
  const end_circle2 = new THREE.Mesh( circle_geometry2, path_material2 );
  start_circle.position.y = 0.01;
  start_circle2.position.y = 0.001;
  start_circle.rotation.x = -Math.PI / 2;
  start_circle2.rotation.x = -Math.PI / 2;
  end_circle.position.y = 0.01;
  end_circle2.position.y = 0.001;
  end_circle.position.z = -250;
  end_circle2.position.z = -250;
  end_circle.rotation.x = -Math.PI / 2;
  end_circle2.rotation.x = -Math.PI / 2;
  scene.add(start_circle);
  scene.add(start_circle2);
  scene.add(end_circle);
  scene.add(end_circle2);
  const path_geometry = new THREE.PlaneGeometry(2, 125);
  const path_geometry2 = new THREE.PlaneGeometry(2.4, 125);
  const path_geometry3 = new THREE.PlaneGeometry(2, 2);
  const path_geometry4 = new THREE.PlaneGeometry(2.4, 2);
  path = new THREE.Mesh( path_geometry, path_material );
  const path2 = new THREE.Mesh( path_geometry2, path_material2 );
  const path3 = new THREE.Mesh( path_geometry3, path_material );
  const path4 = new THREE.Mesh( path_geometry4, path_material2 );
  path.position.y = 0.01;
  path2.position.y = 0.001;
  path3.position.y = 1;
  path4.position.y = 1;
  path.position.z = -62.5;
  path2.position.z = -62.5;
  path3.position.z = -125;
  path4.position.z = -125.01;
  path.rotation.x = -Math.PI / 2;
  path2.rotation.x = -Math.PI / 2;
  scene.add(path);
  scene.add(path2);
  scene.add(path3);
  scene.add(path4);

  const circle_geometry3 = new THREE.CircleGeometry( 3.0, 64 );
  const circle_geometry4 = new THREE.CircleGeometry( 3.2, 64 );
  const contact_circle = new THREE.Mesh( circle_geometry3, path_material );
  const contact_circle2 = new THREE.Mesh( circle_geometry4, path_material2 );
  contact_circle.position.y = 4.5;
  contact_circle.position.z = -125;
  contact_circle2.position.y = 4.5;
  contact_circle2.position.z = -125.01;
  scene.add(contact_circle);
  scene.add(contact_circle2);

  scroll_cube = new Object3DEntity({
    scene: scene,
    object: new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.25, 2),
        // STYLETODO
        new THREE.MeshStandardMaterial({color: 0x16637B})
    ),
    position: new THREE.Vector3(0.0, 0.125, 0.0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(1.0, 1.0, 1.0),
  });
  scroll_cube.AddComponent(new InteractComponent());
  interactables.push(scroll_cube);

  data.meshes.forEach((e) => {
    const obj = new MeshEntity({
      scene: scene,
      path: e.path,
      position: e.position,
      rotation: e.rotation,
      scale: e.scale,
    });
    if (e.interactable)
    {
      obj.AddComponent(new InteractComponent());
      interactables.push(obj);
    }
    if (e.project_group)
      project_group.push(obj);
    if (e.path.includes('pc'))
      obj.AddComponent(new OnClickSoundComponent({
        listener: listener,
        path: 'sounds/pc.ogg',
        loop: false,
        volume: 0.5
      }));
    else if (e.path.includes('n64'))
      obj.AddComponent(new OnClickSoundComponent({
        listener: listener,
        path: 'sounds/tv.ogg',
        loop: false,
        volume: 0.5
      }))
    else if (e.path.includes('guitar'))
      obj.AddComponent(new OnClickSoundComponent({
        listener: listener,
        path: 'sounds/guitar.ogg',
        loop: false,
        volume: 0.5
      }));
    else if (e.path.includes('camera'))
      obj.AddComponent(new OnClickOpenURLComponent({
        url: 'https://www.flickr.com/photos/hibecam/'
      }));
    else if (e.path.includes('records'))
      obj.AddComponent(new OnClickOpenURLComponent({
        url: 'https://soundcloud.com/prjoh_music'
      }));
  });
  data.graphics.forEach((e) => {
    const obj = new GraphicEntity({
      scene: scene,
      path: e.path,
      position: e.position,
      rotation: e.rotation,
      scale: e.scale,
      opacity: 0.0,
    });
    if (e.interactable)
    {
      obj.AddComponent(new InteractComponent());
      interactables.push(obj);
    }
    contact_group.push(obj)
    if (e.path.includes('bitbucket'))
      obj.AddComponent(new OnClickOpenURLComponent({
        url: 'https://bitbucket.org/prjoh/'
      }));
    else if (e.path.includes('youtube'))
      obj.AddComponent(new OnClickOpenURLComponent({
        url: 'https://www.youtube.com/channel/UCt4Y76bNb5RrgEbyXzqgGIg'
      }));
    else if (e.path.includes('wordpress'))
      obj.AddComponent(new OnClickOpenURLComponent({
        url: 'https://prjoh.wordpress.com/'
      }));
    else if (e.path.includes('linkedin'))
      obj.AddComponent(new OnClickOpenURLComponent({
        url: 'https://www.linkedin.com/in/johannes-przybilla-329b64b7/'
      }));
    else if (e.path.includes('twitter'))
      obj.AddComponent(new OnClickOpenURLComponent({
        url: 'https://twitter.com/prjoh_dev'
      }));
    else if (e.path.includes('itchio'))
      obj.AddComponent(new OnClickOpenURLComponent({
        url: 'https://prjoh.itch.io/'
      }));
    else if (e.path.includes('cv'))
      obj.AddComponent(new OnClickOpenURLComponent({
        url: './pdf/cv-przybilla.pdf'
      }));
  });
  data.text_groups[0].texts.forEach((e) => {
      text_group.push(
          new TextEntity({
            scene: scene,
            font: data.text_groups[0].font,
            text: e.text,
            color1: data.text_groups[0].color1,
            color2: data.text_groups[0].color2,
            parameters: data.text_groups[0].parameters,
            position: e.position,
            rotation: e.rotation,
            scale: e.scale,
          })
      );
  });
  data.text_groups[1].texts.forEach((e) => {
    text_group2.push(
        new TextEntity({
          scene: scene,
          font: data.text_groups[1].font,
          text: e.text,
          color1: data.text_groups[1].color1,
          color2: data.text_groups[1].color2,
          parameters: data.text_groups[1].parameters,
          position: e.position,
          rotation: e.rotation,
          scale: e.scale,
        })
    );
  });

  text_plane = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 6.0, 10, 10),
    // STYLETODO
    new THREE.MeshStandardMaterial({ color: 0x16637B })
  );
  text_plane.position.x = 8.5;
  text_plane.position.y = 0.01;
  text_plane.position.z = -25.75;
  text_plane.rotation.x = -Math.PI / 2;
  text_plane.rotation.z = -Math.PI / 3;
  text_plane.scale.y = 0.0;
  scene.add(text_plane);

  text_plane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 3, 10, 10),
    // STYLETODO
    new THREE.MeshStandardMaterial({ color: 0x750B0E })
  );
  text_plane2.position.x = 6.0;
  text_plane2.position.y = 0.01;
  text_plane2.position.z = -72.0;
  text_plane2.rotation.x = -Math.PI / 2;
  text_plane2.scale.y = 0.0;
  scene.add(text_plane2);
}
init_scene();


// Setup scene animations
let animated_objects = {
  camera: camera,
  header: header,
  ground: ground,
  sky: sky,
  text_plane: text_plane,
  text_plane2: text_plane2,
  path: path,
  scroll_cube: scroll_cube,
  text_group: text_group,
  text_group2: text_group2,
  contact_group: contact_group,
  project_group: project_group,
};
const animator = new Animator({
  animated_objects: animated_objects,
  scene_animation: data.scene_animation,
  is_mobile: hasTouchScreen,
});


function on_window_resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const pointer = new THREE.Vector2();
// const pointer_delta = new THREE.Vector2();
function on_touch_move(event) {
  pointer.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
}
function on_mouse_move(event) {
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // pointer_delta.x = event.movementX;
  // pointer_delta.y = event.movementY;
}

let selected = null;
let current_content = null;
function on_mouse_down(event) {
  if (!hasTouchScreen && event.button !== 0)
    return;

  if (intersected.length === 0 || current_content !== null)
    return;

  if (intersected.length > 1)
    console.warn("Multiple interactables intersected!");

  const e = intersected[0];
  // Clean up previous selection
  if (selected && e !== selected)
    remove_selection();

  // Process current selection
  selected = e;

  selected.Broadcast("Clicked", {});

  if (selected.name in content)
  {
    current_content = content[selected.name];
    content_button = current_content.getElementsByClassName('scene-overlay-button').item(0);
    current_content.getElementsByClassName('scene-overlay-content-body').item(0).scrollTop = 0;
    set_content_button_handlers();
    content_container.classList.add('active');
    content_button.classList.add('active');
    current_content.classList.add('active');
    animator.SetEventListener(false);
  }
}


function remove_selection() {
  selected.Broadcast("Unselect", {});
  selected.Broadcast("StopSound", {});

  if (selected.name in content)
  {
    content_container.classList.remove('active');
    content_button.classList.remove('hover');
    current_content.classList.remove('active');

    unset_content_button_handlers();

    current_content = null;
    content_button = null;
    selected = null;

    animator.SetEventListener(true);
  }
}

// function on_key_down(event) {
//   switch (event.keyCode) {
//     case 87: // w
//       camera_translation.z = 1;
//       break;
//     case 65: // a
//       camera_translation.x = -1;
//       break;
//     case 83: // s
//       camera_translation.z = -1;
//       break;
//     case 68: // d
//       camera_translation.x = 1;
//       break;
//     default:
//   }
// }
//
// function on_key_up(event) {
//   switch (event.keyCode) {
//     case 87: // w
//       camera_translation.z = 0;
//       break;
//     case 65: // a
//       camera_translation.x = 0;
//       break;
//     case 83: // s
//       camera_translation.z = 0;
//       break;
//     case 68: // d
//       camera_translation.x = 0;
//       break;
//     default:
//   }
// }

// let is_locked = false;
// let lock_timeout = 0;
// function on_pointer_lock_change() {
//   if (document.pointerLockElement === renderer.domElement)
//     is_locked = true;
//   else {
//     is_locked = false;
//     lock_timeout = 1500;
//   }
// }


let request_update;
let request_update_id = null;
function set_request_update(is_active) {
  console.log("renderer_active=" + is_active)
  if (request_update_id !== null)
    cancelAnimationFrame(request_update_id);

  if (is_active)
  {
    request_update = true;
    update();
  }
  else
    request_update = false;
}

function on_content_button_clicked() {
  remove_selection();
}

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
let intersected = [];
let camera_rotation = new THREE.Euler(0, 0, 0, 'YXZ');
let camera_translation = new THREE.Vector3();
let camera_forward = new THREE.Vector3();
let camera_right = new THREE.Vector3();
function update() {
  if (request_update)
    request_update_id = requestAnimationFrame(update);

  const delta = clock.getDelta();

  // Check for pointer intersections
  if (current_content == null)
  {
    raycaster.setFromCamera(pointer, camera);
    interactables.forEach((e) => {
      const prev_intersected = intersected.indexOf(e);
      const intersects = raycaster.intersectObject(e.object, true);
      if (intersects.length > 0) {
        if (prev_intersected === -1)
        {
          if (e !== selected)
            e.Broadcast("Select", {});
          intersected.push(e)
        }
      }
      else {
        if (prev_intersected !== -1)
        {
          if (e !== selected)
            e.Broadcast("Unselect", {});
          intersected.splice(prev_intersected, 1);
        }
      }
    });
  }

  // Update animator
  // text_group.Update(delta);
  // if (current_content == null)
  animator.Update(delta);

  // Fly camera (DEBUG)
  // if (is_locked)
  // {
  //   camera_rotation.setFromQuaternion(camera.quaternion);
  //   camera_rotation.x -= pointer_delta.y * delta * 0.1;
  //   camera_rotation.x = Math.max( Math.PI / 2 - Math.PI, Math.min( Math.PI / 2 - 0, camera_rotation.x ) );
  //   camera_rotation.y -= pointer_delta.x * delta * 0.1;
  //   camera.quaternion.setFromEuler(camera_rotation);
  //
  //   pointer_delta.x = 0
  //   pointer_delta.y = 0
  //
  //   camera.getWorldDirection(camera_forward)
  //   camera_right.setFromMatrixColumn(camera.matrix,0);
  //   camera.position.addScaledVector(camera_right, camera_translation.x * 25.0 * delta);
  //   camera.position.addScaledVector(camera_forward, camera_translation.z * 25.0 * delta);
  // }

  // update_camera_ui();
  // update_hover_clicked_ui();

  // stats.update();

  renderer.render(scene, camera);
}
