import ConfigurableParams from '../../../data/configurable_params';
import { Tween, Black, Graphics, Sprite, DisplayObject, TextField, Ease, Timer } from '../../../utils/black-engine.module';
import UTween from '../../helpers/../../utils/utween';

export default class Tutorial extends DisplayObject {
  constructor() {
    super();

    this._sign = null;

    this.scaleX = 1;
    this.scaleY = 1;

    this.visible = false;
  }

  onAdded() {
    this._bg = new Graphics();
    this._bg.fillStyle(0x000000, 0.5);
    const w = 2000;
    const h = 350;
    this._bg.rect(-w / 2, -h / 2, w, h);
    this._bg.fill();
    this.add(this._bg);

    this._text = new TextField(
      'TAP TO JUMP',
      'lilita_one',
      0xffffff,
      100
    );
    this._text.alignAnchor(0.5, 0.5);
    this.add(this._text);
  }

  show() {
    this.visible = true;

    const textTween = new Tween({
      scaleX: [1.2, 1],
      scaleY: [1.2, 1],
    }, 1, { loop: true });
    this._text.add(textTween);
  }

  hide() {
    const hideTween = new Tween({
      y: Black.stage.bounds.bottom + 250
    }, 0.2);

    this.add(hideTween);

    hideTween.on('complete', msg => this.visible = false);
  }
}

