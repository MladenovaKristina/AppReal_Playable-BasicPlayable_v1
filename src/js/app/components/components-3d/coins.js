// Coins.js
import * as THREE from "three";

export default class Coin extends THREE.Object3D {
  constructor() {
    super();
    this._createCoin();
    this._animateCoin();
  }

  _createCoin() {


    // const increment = 10;
    // const numCoins = this._jumpsToStore; // Number of coins based on jumps

    // let coinsArray = [];

    // for (let i = 0; i < numCoins; i++) {        
    // const position = increment * (i + 0.5);
    const geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 15);
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.7,
      metalness: 0,
      map: THREE.Cache.get('coin')
    });
    const coin = new THREE.Mesh(geometry, material);
    coin.rotation.x = Math.PI / 2;
    coin.position.y = 1;
    coin.position.z = -5;
    coin.rotation.z = 0;

    this._coin = coin;
    this.add(coin);
  }

  _animateCoin() {
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      this._coin.rotation.z = elapsedTime * 3;

      requestAnimationFrame(animate);
    };

    animate();
  }
}
