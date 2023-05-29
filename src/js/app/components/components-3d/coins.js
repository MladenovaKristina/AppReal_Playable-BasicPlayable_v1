import * as THREE from "three";

export default class Coin extends THREE.Object3D {
  constructor() {
    super();
    this._createCoin();
    this._animateCoin();
  }

  _createCoin() {

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

      this._coin.rotation.z = elapsedTime * 2;

      requestAnimationFrame(animate);
    };

    animate();
  }
}
