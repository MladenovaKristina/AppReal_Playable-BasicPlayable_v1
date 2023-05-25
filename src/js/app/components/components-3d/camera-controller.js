import * as THREE from "three";
import Helpers from "../../helpers/helpers";

export default class CameraController {
  constructor(camera, player) {
    this._camera = camera;
    this._player = player;
    this._position = new THREE.Vector3(0, 0, 0);
    this._playerOffsetZ = 0;

    this._updatePositions();
    this._updateTransform();
  }

  onResize() {
    this._updatePositions();
    this._updateTransform();

    // this._camera.lookAt(0, 0.5, 0);
    this._camera.rotation.x = -0.55;
    // console.log(this._camera.rotation)
  }

  _updateTransform() {
    const position = this._getPosition();
    this._camera.position.copy(position);
  }

  _updatePositions() {
    if (Helpers.LP(false, true)) {
      this._position = new THREE.Vector3(0, 5, 5 + this._playerOffsetZ);
    }
    else {
      this._position = new THREE.Vector3(0, 5, 5 + this._playerOffsetZ);
    }

  }

  onUpdate() {
    this._playerOffsetZ = this._player.position.z + 1;
    this._updatePositions();
    this._updateTransform();
  }

  _getPosition() {
    return this._position;
  }
}
