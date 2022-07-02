import {Component} from "./Component.js";
import * as THREE from "./vendor/three/build/three.module.js";
import {LoadingManager} from "./LoadingManager.js";

class OnClickComponent extends Component {
  constructor() {
    super();
  }

  InitComponent() {
    this.parent.RegisterHandler("Clicked", (msg) => this.OnClicked(msg));
  }

  OnClicked(msg) {}
}


class OnClickSoundComponent extends OnClickComponent {
  constructor(props) {
    super();
    this.audio_source = new THREE.Audio(props.listener);
    this.LoadAudio(props)
  }

  // load a sound and set it as the Audio object's buffer
  LoadAudio(props) {
    const audioLoader = new THREE.AudioLoader(LoadingManager.instance());
    audioLoader.load(props.path, (buffer) => {
      this.audio_source.setBuffer(buffer);
      this.audio_source.setLoop(props.loop);
      this.audio_source.setVolume(props.volume);
    });
  }

  InitComponent() {
    super.InitComponent();
    this.parent.RegisterHandler("StopSound", (msg) => {
      if (this.audio_source.isPlaying)
        this.audio_source.stop();
    });
  }

  OnClicked(msg) {
    super.OnClicked(msg);
    if (this.audio_source.isPlaying)
      this.audio_source.stop();
    this.audio_source.play();
  }
}

class OnClickOpenURLComponent extends OnClickComponent {
  constructor(props) {
    super();
    this.url = props.url;
  }

  OnClicked(msg) {
    super.OnClicked(msg);
    window.open(this.url, '_blank');
  }
}

export { OnClickSoundComponent,
         OnClickOpenURLComponent };