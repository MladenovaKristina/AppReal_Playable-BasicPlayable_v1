import { request } from "express";
import * as THREE from "three";

export default class Coins extends THREE.Object3D {
  constructor() {
    super();

    this._createCoins();
  }

  _createCoins() {
    let numberOfCoins = Math.floor(Math.random() * 2);

    for (let i = 0; i < numberOfCoins; i++) {
      console.log("im making bank");
      const geometry = new THREE.CylinderGeometry(1, 1, 0.5, 10);
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      this.cylinder = new THREE.Mesh(geometry, material);
      this.cylinder.rotation.x = 90;
      this.cylinder.position.y = 1;
      this.cylinder.position.z = +5;
      this.add(this.cylinder);
    }

    this.spin();
  }

  spin() {
    new UTween(this.cylinder.rotation, {
      y: this.cylinder.rotation.y + Math.PI,
    });
  }
}
