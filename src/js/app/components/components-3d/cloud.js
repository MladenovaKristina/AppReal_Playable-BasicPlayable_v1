import * as THREE from "three";

export default class Cloud extends THREE.Object3D {
    constructor() {
        super();
        this._createCloud();
    }
    _createCloud() {
        let cloudClusters = Math.random() * 5;
        let positionX = Math.random() * 0.5 + 2;
        let positionY = Math.ceil(Math.random() * 0.5 + 0.4);
        let depth = 1;


        for (let i = 0; i <= cloudClusters; i++) {
            const randomX = THREE.MathUtils.randFloatSpread(positionX);
            const randomY = THREE.MathUtils.randFloatSpread(positionY);
            const randomZ = THREE.MathUtils.randFloatSpread(depth);

            const objectSize = Math.random() * 0.8 + 0.4; // Vary the size of the objects

            const objectGeometry = new THREE.SphereGeometry(objectSize);
            const objectMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const cloud = new THREE.Mesh(objectGeometry, objectMaterial);
            cloud.position.set(randomX, randomY, randomZ);

            this._cloud = cloud;
            this.add(cloud);
        }
        this._animateCloud();

    }
    _animateCloud() {
        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            this._cloud.position.x = elapsedTime * 0.04;

            requestAnimationFrame(animate);
        };

        animate();
    }


}