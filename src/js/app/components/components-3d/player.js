import * as THREE from "three";
import Helpers from "../../helpers/helpers";
import UTween from "../../../utils/utween";
import { Ease } from "../../../utils/black-engine.module";

export default class Player extends THREE.Object3D {
  constructor() {
    super();

    this._state = STATES.GROUNDED;
    this._view = null;

    this._initView();
  }

  _initView() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.7,
      metalness: 0,
      map: THREE.Cache.get('texture_leopard')
    });

    const view = this._view = new THREE.Mesh(geometry, material);
    view.position.y = 0.5;
    this.add(view);
  }

  jump() {
    if (this._state !== STATES.GROUNDED) return false;

    this._state = STATES.JUMPING;

    new UTween(this._view.rotation, {
      y: this._view.rotation.y + Math.PI,

    }, JUMP_TIME, { ease: Ease.sinusoidalOut, delay: 0.2 });

    new UTween(this.scale, {
      y: [0.6, 1]
    }, 0.3, { ease: Ease.sinusoidalIn });

    new UTween(this.position, {
      z: this.position.z - JUMP_LENGTH,
      y: [0.3, 0]
    }, JUMP_TIME, { ease: Ease.sinusoidalOut, delay: 0.2 })
      .on('complete', msg => {
        this._state = STATES.GROUNDED;
      });

    return true;
  }
}

const STATES = {
  GROUNDED: 0,
  JUMPING: 1
};

const JUMP_LENGTH = 5;
const JUMP_TIME = 0.7;
