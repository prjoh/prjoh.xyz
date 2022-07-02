import * as THREE from "./vendor/three/build/three.module.js";
import {Entity} from "./Entity.js";


const Direction = {
  FORWARD: 0,
  BACKWARD: 1,
};
const Easing = {
  LINEAR: x => x,
  IN_CUBIC: x => x * x * x,
  OUT_CUBIC: x => 1 - Math.pow(1 - x, 3),
  OUT_QUINT: x => 1 - Math.pow(1 - x, 5),
  IN_EXPO: x => {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10)
  },
  OUT_EXPO: x => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
  },
  IN_ELASTIC: x => {
    return x <= 0.0 ? 0.0
        : x >= 1.0 ? 1.0
            : -Math.pow(2.0, 10.0 * x - 10.0) * Math.sin((x * 10.0 - 10.75) * (2 * Math.PI) / 3)
  },
  OUT_ELASTIC: x => {
    return x <= 0.0 ? 0.0
        : x >= 1.0 ? 1.0
            : Math.pow(2.0, -10.0 * x) * Math.sin((x * 10.0 - 0.75) * (2 * Math.PI) / 3) + 1.0
  },
  OUT_BACK: x => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
}
const AnimationType = {
  POSITION_Y: 0,
  OPACITY: 1,
  POSITION_XY: 2,
  POSITION: 3,
}

function OneshotAnimation(object_id, type, from, to, duration, easing,
                          group_animation = false, delay = 0, duration_bw = 0, easing_bw = null) {
  this.object_id = object_id;
  this.type = type;
  this.from = from;
  this.to = to;
  this.duration_fw = duration;
  this.duration_bw = duration_bw;
  this.easing_fw = easing;
  this.easing_bw = easing_bw;
  this.group_animation = group_animation;
  this.delay = delay;
  this.state = new OneshotAnimationState();
}

function OneshotAnimationState() {
  this.playing = false;
  this.callback = null;
  this.direction = Direction.FORWARD;
  this.elapsed = 0;
}

function ScrollAnimation(keyframes, resolution)
{
  this.keyframes = keyframes
  this.resolution = resolution
}

function TransformKeyframe(object_id, position, rotation, scale, fw_easing = Easing.LINEAR, bw_easing = Easing.LINEAR) {
  this.object_id = object_id;
  this.position = position;
  this.rotation = rotation;
  this.scale = scale;
  this.fw_easing = fw_easing;
  this.bw_easing = bw_easing;
}

function HTMLOpacityKeyframe(object_id, opacity, fw_easing, bw_easing) {
  this.object_id = object_id;
  this.opacity = opacity;
  this.fw_easing = fw_easing;
  this.bw_easing = bw_easing;
}

function MaterialOpacityKeyframe(object_id, opacity, fw_easing, bw_easing) {
  this.object_id = object_id;
  this.opacity = opacity;
  this.fw_easing = fw_easing;
  this.bw_easing = bw_easing;
}

function MaterialColorKeyframe(object_id, color, fw_easing, bw_easing) {
  this.object_id = object_id;
  this.color = color;
  this.fw_easing = fw_easing;
  this.bw_easing = bw_easing;
}

function SkyColorKeyframe(object_id, color, fw_easing, bw_easing) {
  this.object_id = object_id;
  this.color = color;
  this.fw_easing = fw_easing;
  this.bw_easing = bw_easing;
}

// function Keyframe(object_id, values, fw_easing = Easing.LINEAR, bw_easing = Easing.LINEAR)
// {
//   this.object_id = object_id;
//   this.values = values;
//   this.fw_easing = fw_easing;
//   this.bw_easing = bw_easing;
// }

class Animator {
  constructor(props) {
    this.animated_objects = props.animated_objects;
    this.scene_animation = props.scene_animation;
    this.is_mobile = props.is_mobile;

    this.current_direction = Direction.FORWARD;
    this.progress = 0;
    this.current_keyframe = 1;

    this.scroll_oneshot_playing = false;

    this.oneshot_animations = {};
    this.scene_animation.forEach((e) => {
      if (e instanceof OneshotAnimation)
      {
        this.oneshot_animations[e.object_id] = {};
        this.oneshot_animations[e.object_id]["scroll"] = e;
      }
    });

    this.lastTouchY = 0;
    this.lastTouchEvent = 0;

    this.animation_frame_id = null;
    this.final_move_amount = 0;
    this.final_move_direction = Direction.FORWARD;
    this.start = 0;
    this.previousTimeStamp = 0;

    this.SetEventListener(true);
  }

  SetEventListener(setActive) {
    console.log("SetEventListener: " + setActive);
    if (this.is_mobile)
      this.SetTouchEventListener(setActive);
    else
      this.SetWheelEventListener(setActive);
  }

  SetTouchEventListener(setActive) {
    if (setActive)
    {
      this.on_touch_start_handler = this.OnTouchStart.bind(this);
      this.on_touch_move_handler = this.OnTouchMove.bind(this);
      this.on_touch_end_handler = this.OnTouchEnd.bind(this);
      document.addEventListener('touchstart', this.on_touch_start_handler, false);
      document.addEventListener('touchmove', this.on_touch_move_handler, false);
      document.addEventListener('touchend', this.on_touch_end_handler, false);
      // document.ontouchstart = (event) => { this.OnTouchStart(event); };
      // document.ontouchmove = (event) => { this.OnTouchMove(event); };
      // document.ontouchend = (event) => { this.OnTouchEnd(event); };
    }
    else
    {
      document.removeEventListener('touchstart', this.on_touch_start_handler);
      document.removeEventListener('touchmove', this.on_touch_move_handler);
      document.removeEventListener('touchend', this.on_touch_end_handler);
      // document.ontouchstart = null;
      // document.ontouchmove = null;
      // document.ontouchend = null;
    }
  }

  OnTouchStart(event) {
    if (this.animation_frame_id !== null)
    {
      window.cancelAnimationFrame(this.animation_frame_id)
      this.start = 0;
      this.previousTimeStamp = 0;
      this.final_move_amount = 0;
      this.animation_frame_id = null;
    }
    this.lastTouchY = event.touches[0].pageY;
  }

  OnTouchMove(event) {
    let move_amount = (this.lastTouchY - event.touches[0].pageY) * 0.05;
    this.lastTouchY = event.touches[0].pageY;

    let move_direction = Direction.FORWARD;
    // Move backward
    if (move_amount < 0) {
      move_direction = Direction.BACKWARD;
      move_amount = -move_amount
    }

    this.final_move_amount = move_amount * 1.2;
    this.final_move_direction = move_direction;

    if (!this.scroll_oneshot_playing)
      this.AnimateScene(move_direction, move_amount);
  }

  OnTouchEnd(event) {
    this.animation_frame_id = window.requestAnimationFrame(this.EaseTouchScroll.bind(this));
  }

  EaseTouchScroll(timestamp) {
    if (this.start === 0) {
      this.start = timestamp;
    }
    const elapsed = timestamp - this.start;

    if (this.previousTimeStamp !== timestamp) {
      let move_amount = THREE.MathUtils.lerp(this.final_move_amount, 0, Easing.OUT_EXPO(elapsed/1000));
      if (!this.scroll_oneshot_playing)
        this.AnimateScene(this.final_move_direction, move_amount);
    }

    if (elapsed < 1000) { // Stop the animation after 2 seconds
      this.previousTimeStamp = timestamp
      this.animation_frame_id = window.requestAnimationFrame(this.EaseTouchScroll.bind(this));
    }
    else
    {
      this.animation_frame_id = null;
      this.start = 0;
      this.previousTimeStamp = 0;
      this.final_move_amount = 0;
    }
  }

  SetWheelEventListener(setActive) {
    if (setActive)
      document.onwheel = (event) => { this.OnWheel(event); };
    else
      document.onwheel = null;
  }

  OnWheel(event) {
    let move_amount = event.wheelDeltaY;

    if (Math.abs(move_amount) > 500)
      move_amount *= -0.0015;
    else if (Math.abs(move_amount) > 300)
      move_amount *= -0.0025;
    else
      move_amount *= -0.004;

    let move_direction = Direction.FORWARD;
    // Move backward
    if (event.deltaY < 0) {
      move_direction = Direction.BACKWARD;
      move_amount = -move_amount
    }

    if (!this.scroll_oneshot_playing)
      this.AnimateScene(move_direction, move_amount);
  }

  // TODO: animated type is not consistent
  AnimateScene(direction, move_amount) {
    // Update state if we switched animation direction
    if (this.current_direction !== direction) {
      this.current_direction = direction;
      this.progress = Math.max(0.01, Math.min(0.99, 1 - this.progress));
      if (direction === Direction.FORWARD)
        this.current_keyframe += 1;
      else
        this.current_keyframe -= 1;
    }

    // Return early if we are at the end of animation
    if (this.progress >= 1.0)
      return;

    const animate_forward = this.current_direction === Direction.FORWARD;
    const from = animate_forward ?
        this.scene_animation[this.current_keyframe - 1] : this.scene_animation[this.current_keyframe + 1];
    const to = this.scene_animation[this.current_keyframe];

    if (to instanceof OneshotAnimation)
    {
      this.scroll_oneshot_playing = true;
      this.current_keyframe = animate_forward ? this.current_keyframe + 2 : this.current_keyframe - 2;  // TODO: This is stupid. It breaks as soon as we put oneshots at the beginning or end or two consecutive oneshots.
      this.PlayOneshotAnimation(to.object_id, "scroll", this.current_direction, () => { this.OnScrollOneshotComplete() })
      return;
    }

    this.progress += move_amount / (animate_forward ? to.resolution : from.resolution);
    this.progress = Math.max(0.0, Math.min(1.0, this.progress));

    for (const from_key of from.keyframes) {
      const easing = animate_forward ? from_key.fw_easing : from_key.bw_easing;
      const to_key = to.keyframes.find(tk => tk.object_id === from_key.object_id);
      if (to_key === undefined)
        continue;

      let animated = this.animated_objects[from_key.object_id];
      if (from_key instanceof TransformKeyframe && to_key instanceof TransformKeyframe)
      {
        if (animated instanceof Entity)
          animated = animated.object;
        animated.position.lerpVectors(from_key.position, to_key.position, easing(this.progress));
        animated.quaternion.slerpQuaternions(from_key.rotation, to_key.rotation, easing(this.progress));
        animated.scale.lerpVectors(from_key.scale, to_key.scale, easing(this.progress));
      }
      else if (from_key instanceof HTMLOpacityKeyframe && to_key instanceof HTMLOpacityKeyframe)
      {
        const new_val = THREE.MathUtils.lerp(from_key.opacity, to_key.opacity, easing(this.progress));
        animated.style.opacity = String(new_val);
      }
      else if (from_key instanceof MaterialOpacityKeyframe && to_key instanceof MaterialOpacityKeyframe)
      {
        const new_val = THREE.MathUtils.lerp(from_key.opacity, to_key.opacity, easing(this.progress));
        if (animated instanceof Entity)
          animated = [animated];

        animated.forEach((entity) => {
          entity.object.traverse(c => {
            if (c.material && c.material.transparent)
              c.material.opacity = new_val;
          });
        });
      }
      else if (from_key instanceof MaterialColorKeyframe && to_key instanceof MaterialColorKeyframe)
      {
        const r = THREE.MathUtils.lerp(from_key.color.r, to_key.color.r, easing(this.progress));
        const g = THREE.MathUtils.lerp(from_key.color.g, to_key.color.g, easing(this.progress));
        const b = THREE.MathUtils.lerp(from_key.color.b, to_key.color.b, easing(this.progress));
        animated.traverse(c => {
          if (c.material)
          {
            c.material.color.r = r;
            c.material.color.g = g;
            c.material.color.b = b;
          }
        });
      }
      else if (from_key instanceof SkyColorKeyframe && to_key instanceof SkyColorKeyframe)
      {
        const r = THREE.MathUtils.lerp(from_key.color.r, to_key.color.r, easing(this.progress));
        const g = THREE.MathUtils.lerp(from_key.color.g, to_key.color.g, easing(this.progress));
        const b = THREE.MathUtils.lerp(from_key.color.b, to_key.color.b, easing(this.progress));
        animated.material.uniforms.topColor.value.r = r;
        animated.material.uniforms.topColor.value.g = g;
        animated.material.uniforms.topColor.value.b = b;
      }
    }

    // Try to get next keyframe if we are at the end of current keyframe
    if (this.progress >= 1.0) {
      const reached_end = animate_forward ?
          this.current_keyframe === this.scene_animation.length - 1 : this.current_keyframe === 0;
      if (reached_end === false) {
        this.progress = 0;
        this.current_keyframe = animate_forward ? this.current_keyframe + 1 : this.current_keyframe - 1;
      }
    }
  }

  OnScrollOneshotComplete() {
    this.scroll_oneshot_playing = false;
  }

  AddOneshotAnimation(object, object_id, name, params) {
    this.animated_objects[object_id] = object;
    const animation = new OneshotAnimation(object_id,
                                            params.type,
                                            params.from,
                                            params.to,
                                            params.duration,
                                            params.easing)
    if (params.delay)
      animation.delay = params.delay;
    if (params.duration_bw)
      animation.duration_bw = params.duration_bw;
    if (params.easing_bw)
      animation.easing_bw = params.easing_bw;
    if (!(object_id in this.oneshot_animations))
      this.oneshot_animations[object_id] = {};
    this.oneshot_animations[object_id][name] = animation;
  }

  PlayOneshotAnimation(object_id, name, direction = Direction.FORWARD, callback = null) {
    const animation = this.oneshot_animations[object_id][name];

    if (callback instanceof Function)
      animation.state.callback = callback;

    if (animation.state.direction !== direction)
    {
      const to = animation.from;
      animation.from = animation.to;
      animation.to = to;
      animation.state.direction = direction;
    }

    animation.state.elapsed = 0;
    animation.state.direction = direction;
    animation.state.playing = true;
  }

  Update(deltaS) {
    for (const [object_id, animations] of Object.entries(this.oneshot_animations)) {
      for (const [_, animation] of Object.entries(animations))
      {
        if (!animation.state.playing)
          continue;

        animation.state.elapsed += deltaS * 1000;

        const e = this.animated_objects[object_id];
        const direction = animation.state.direction;
        const is_direction_forward = direction === Direction.FORWARD;
        const easing = is_direction_forward ? animation.easing_fw : animation.easing_bw;
        const duration = is_direction_forward ? animation.duration_fw : animation.duration_bw;

        let total_delay = animation.delay;
        if (animation.group_animation)
        {
          total_delay = animation.delay * e.length;
          e.forEach((c, i) => {
            if (animation.state.elapsed >= i * animation.delay)
              this.DoEase(animation.type, c.object, animation.from[i], animation.to[i], easing, (animation.state.elapsed - i * animation.delay)/duration);
          });
        }
        else
        {
          if (animation.state.elapsed >= animation.delay)
            this.DoEase(animation.type, e.object, animation.from, animation.to, easing, (animation.state.elapsed - animation.delay)/duration);
        }

        if (animation.state.elapsed >= duration + total_delay)
        {
          if (animation.group_animation)
            e.forEach((c, i) => this.DoEase(animation.type, c.object, animation.from[i], animation.to[i], easing, 1.0));
          else
            this.DoEase(animation.type, e.object, animation.from, animation.to, easing, 1.0);
          animation.state.playing = false;
          if (animation.state.callback instanceof Function)
            animation.state.callback()
        }
      }
    }
  }

  DoEase(type, object, from, to, easing, progress)
  {
    if (type === AnimationType.POSITION_Y)
      object.position.y = THREE.MathUtils.lerp(from, to, easing(progress));
    else if (type === AnimationType.OPACITY)
      object.style.opacity = THREE.MathUtils.lerp(from, to, easing(progress));
    else if (type === AnimationType.POSITION_XY)
    {
      object.position.x = THREE.MathUtils.lerp(from[0], to[0], easing(progress));
      object.position.y = THREE.MathUtils.lerp(from[1], to[1], easing(progress));
    }
    else if (type === AnimationType.POSITION)
    {
      object.position.x = THREE.MathUtils.lerp(from[0], to[0], easing(progress));
      object.position.y = THREE.MathUtils.lerp(from[1], to[1], easing(progress));
      object.position.z = THREE.MathUtils.lerp(from[2], to[2], easing(progress));
    }
  }
}

export { Animator,
          Direction,
          Easing,
          AnimationType,
          OneshotAnimation,
          ScrollAnimation,
          TransformKeyframe,
          HTMLOpacityKeyframe,
          MaterialOpacityKeyframe,
          MaterialColorKeyframe,
          SkyColorKeyframe };