import { Black, MessageDispatcher } from "../../utils/black-engine.module";
import * as THREE from 'three';
import Model from "../../data/model";
import Layout2D from "./components-2d/layout-2d";
import CameraController from "./components-3d/camera-controller";
import SoundsController from "./kernel/soundscontroller";
import ConfigurableParams from "../../data/configurable_params";
import Environment from "./components-3d/environment";
import Player from "./components-3d/player";
import Coin from "./components-3d/coins";
import Cloud from "./components-3d/cloud";
import { forEach } from "jszip";

export default class Game {

  constructor(scene, camera, renderer) {

    this.messageDispatcher = new MessageDispatcher();
    this.onFinishEvent = 'onFinishEvent';

    this._scene = scene;
    this._camera = camera;
    this._renderer = renderer;

    this._state = STATES.INTRO;

    this._storeOnDown = false;
    this._clicks = 0;
    this._startTime = 0;
    this._lastClickTime = 0;

    this._clicksToStore = ConfigurableParams.getData()["market_details"]["go_to_market_after_x_click"]["value"];
    this._timeToStore = ConfigurableParams.getData()["market_details"]["go_to_market_after_x_time"]["value"];

    this._jumps = 0;
    this._jumpsToStore = 6;

    this._score = 0;


    this._init();

    this.onResize();
    Black.stage.on('resize', this.onResize, this);
  }

  _init() {
    this._initUI();
    this._initCloud();

    this._initFog();

    this._initEnvironment();
    this._initPlayer();
    this._initCoins();

    this._cameraController = new CameraController(this._camera.threeCamera, this._player);
  }

  start() {
    this._layout2d.showHint();

    this._startTime = Date.now();
    this._state = STATES.GAMEPLAY;

    if (ConfigurableParams.isXTime()) {
      setInterval(() => {
        this._countTime();
      }, 1000);
    }
  }

  _initUI() {
    this._layout2d = new Layout2D();
    Black.stage.add(this._layout2d);

    this._layout2d.on(this._layout2d.onPlayBtnClickEvent, (msg) => {
      this._state = STATES.FINAL;
      this.messageDispatcher.post(this.onFinishEvent);
    });
  }
  _initCloud() {
    let cloudArray = [];
    for (let i = 0; i < this._jumpsToStore; i++) {
      const cloud = new Cloud();

      cloud.position.z = -i * 5;
      cloud.position.y = Math.random() * 0.8 - 2;
      cloud.position.x = Math.random() * 6 - 4;
      cloudArray.push(cloud);
    }
    this._scene.add(...cloudArray);
    this._animateCloud(cloudArray);
  }

  _animateCloud(cloudArray) {
    cloudArray.forEach(cloud => {

      const clock = new THREE.Clock();

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        let cloudXSpeed = elapsedTime * 0.05 * (cloud.position.z + 2);

        if (cloud.position.x < -10 || cloud.position.x > 10) {
          cloudXSpeed *= -1; // Reverse the animation direction
        }

        cloud.position.x = cloudXSpeed;
        requestAnimationFrame(animate);
      };



      animate();
    });
  }

  _displaceClouds(cloudArray) {
    console.log("I got moved to the back");

  }


  _initFog() {
    const rendererColor = this._renderer.threeRenderer.getClearColor();
    this._scene.fog = new THREE.Fog(rendererColor, 10, 30);
  }



  _initEnvironment() {
    const environment = new Environment();
    this._scene.add(environment);
  }

  _initPlayer() {
    const player = this._player = new Player();
    this._scene.add(player);
  }

  _initCoins() {
    this._coins = [];
    for (let i = 0; i < this._jumpsToStore; i++) {
      const coin = new Coin();
      coin.position.z = -i * 10;
      this._coins.push(coin);
    }
    this._scene.add(...this._coins);
  }


  onDown(x, y) {
    const downloadBtnClicked = this._layout2d.onDown(x, y);
    if (downloadBtnClicked) return;

    this._isDown = true;
    this._lastClickTime = Date.now();

    if (this._storeOnDown) {
      this._onFinish();
    }

    if (this._state === STATES.GAMEPLAY) {
      this._makeJump();
    }

    this._countClicks();
  }

  _makeJump() {
    const jumpSucceed = this._player.jump();

    if (jumpSucceed) {
      this._jumps++;

      this._layout2d._progressBar.onClick();
      this._detectCollision();

      if (this._jumps >= this._jumpsToStore) {
        this._state = STATES.OUTRO;

        setTimeout(() => {
          this._onFinish();
        }, 500);
      }
      this._displaceClouds(this.cloudArray);
    }
  }
  _detectCollision() {
    const playerHitbox = new THREE.Sphere(this._player.position, 1);

    this._coins.forEach(coin => {
      const coinHitbox = new THREE.Sphere(coin.position, 1)
      const distance = playerHitbox.center.distanceTo(coinHitbox.center);

      if (distance < 0.5) {
        setTimeout(() => {
          this._handleCollision(coin);
        }, 600);

      }
    });

    return false;
  }

  _handleCollision(coin) {
    this._score++;

    if (ConfigurableParams.getData()['audio']['coin']['value'])
      SoundsController.playWithKey('coin');
    this._scene.remove(coin);

    this._layout2d.enableScoreAnimation();
    this._layout2d._coinsCounter.scoreUpdate();

  }

  onMove(x, y) {
    // if (this._state !== STATES.GAMEPLAY) return;

    this._layout2d.onMove(x, y);
  }

  onUp() {
    // if (this._state !== STATES.GAMEPLAY) return;
    this._isDown = false;

    this._layout2d.onUp();
  }

  _countClicks() {
    if (this._isStore) return;

    this._clicks++;
    if (ConfigurableParams.isXClick() && this._clicks >= this._clicksToStore) {
      this._onFinish();
      console.log('clicks');
    }
  }

  _countTime() {
    if (this._isStore) return;

    if (ConfigurableParams.isXTime() && (Date.now() - this._startTime) / 1000 > this._timeToStore) {
      if (Date.now() - this._lastClickTime < 1500 || this._isDown || ConfigurableParams.isPN())
        this._onFinish()
      else
        this._storeOnDown = true;

      console.log('time');
    }
  }

  onUpdate(dt) {
    if (this._isStore) return;
    dt = Math.min(dt, 0.02);

    this._cameraController.onUpdate();

  }

  onResize() {
    this._cameraController.onResize();
  }

  _onFinish() {
    if (this._state === STATES.FINAL) return;
    this._state = STATES.FINAL;

    if (ConfigurableParams.isPN()) {
      if (Model.platform === 'vungle') {
        parent.postMessage('complete', '*');
      }

      if (ConfigurableParams.getData()['audio']['sound_final_enabled']['value'])
        SoundsController.playWithKey('win');

      this.enableStoreMode();
    }
    else {
      if (Date.now() - this._lastClickTime < 1500 || this._isDown)
        this.messageDispatcher.post(this.onFinishEvent);
      else
        this._storeOnDown = true;
    }
  }

  enableStoreMode() {
    if (this._isStore) return;
    this._isStore = true;
    this._state = STATES.FINAL;

    SoundsController.playWithKey('win');

    this._layout2d.enableStoreMode();
  }
}

const STATES = {
  INTRO: 0, // if we want to make some action before the player interaction
  GAMEPLAY: 1,
  OUTRO: 2, // if we want to make some action before the end screen
  FINAL: 3 // end screen
};
