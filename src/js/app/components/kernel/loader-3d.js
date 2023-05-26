import { TextureLoader, Cache } from 'three';
import GLBLoader from 'three-gltf-loader';

import texture_zebra from '../../../data/textures/3d/texture_zebra.jpg';
import texture_leopard from '../../../data/textures/3d/texture_leopard.jpg';

export default class Loader3D {
  constructor() {
    this.textureLoader = new TextureLoader();
    this.GLBLoader = new GLBLoader();
    this._count = 0;

 }

  load() {
    const objects = [
    ];

    const textures = [
      { name: 'texture_zebra', asset: texture_zebra }
    ];

    textures.push({name:"texture_leopard",asset:texture_leopard});
console.log(textures);
    this._count = objects.length + textures.length;

    return new Promise((resolve, reject) => {
      if (this._count === 0)
        resolve(null);

      objects.forEach((obj, i) => {
        this.GLBLoader.load(obj.asset, (object3d) => {
          Cache.add(obj.name, object3d);
          this._count--;

          if (this._count === 0)
            resolve(null);
        });
      });
      

      textures.forEach((txt) => {
        const textureMain = this.textureLoader.load(txt.asset);
        textureMain.flipY = false;
        Cache.add(txt.name, textureMain);

        this._count--;

        if (this._count === 0)
          resolve(null);
      });
    });
  }
}