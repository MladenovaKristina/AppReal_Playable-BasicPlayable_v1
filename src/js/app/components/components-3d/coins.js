// Coins.js
import * as THREE from "three";

export default class Coins extends THREE.Object3D {
  constructor(jumpsToStore) {
    super();
    console.log("I'm a coin");
    this._jumpsToStore = jumpsToStore;
    this._createCoins();
    this.animateCoins();
  }

  _createCoins() {
    console.log("I'm making bank");

    const increment = 10;
    const numCoins = this._jumpsToStore; // Number of coins based on jumps

    let coinsArray = [];

    for (let i = 0; i < numCoins; i++) {
      const position = increment * (i + 0.5);
      const geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 15);
      const material = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        metalness: 0,
        map: THREE.Cache.get('coin')
      });      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.rotation.x = Math.PI / 2;
      cylinder.position.y = 1;
      cylinder.position.z = -position;
      coinsArray.push(cylinder);
    }

    this.add(...coinsArray);

    console.log("Congrats! You made", coinsArray.length, "coins");

    this.coinsArray = coinsArray; // Store the coins array for animation
  }

  animateCoins() {
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      this.coinsArray.forEach((coin) => {
        coin.rotation.z = elapsedTime*3;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }
}
