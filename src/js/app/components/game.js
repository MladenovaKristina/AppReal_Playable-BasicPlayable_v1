import { Black, MessageDispatcher, Timer, GameObject } from "../../utils/black-engine.module";
import * as THREE from 'three';
import Model from "../../data/model";
import Helpers from "../helpers/helpers";
import Layout2D from "./components-2d/layout-2d";
import CameraController from "./components-3d/camera-controller";
import SoundsController from "./kernel/soundscontroller";
import ConfigurableParams from "../../data/configurable_params";
import Environment from "./components-3d/environment";
import Player from "./components-3d/player";
import Coins from "./components-3d/coins";

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

    this._init();

    this.onResize();
    Black.stage.on('resize', this.onResize, this);
  }

  _init() {
    this._initUI();
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
const coins =this._coins=new Coins();
this._scene.add(coins);
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

      if (this._jumps >= this._jumpsToStore) {
        this._state = STATES.OUTRO;

        setTimeout(() => {
          this._onFinish();
        }, 500);
      }
    }
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
