import * as THREE from "three";
import Helpers from "../../helpers/helpers";

export default class Environment extends THREE.Object3D {
  constructor() {
    super();

    this._createBlocks();
  }

  _createBlocks() {
    const geometry = new THREE.BoxGeometry(2, 10, 2);

    for (let i = 0; i < 10; i++) {
      const material = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        metalness: 0,
        color: new THREE.Color(Helpers.rndColor())
      });

      const block = new THREE.Mesh(geometry, material);
      this.add(block);

      block.position.y = -5;
      block.position.z = -OFFSET * i;
    }
  }
}

const OFFSET = 5;