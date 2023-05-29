import { GameObject, Tween, Ease, Sprite, DisplayObject, TextField } from '../../../utils/black-engine.module';

export default class ScoreAnimation extends DisplayObject {
    constructor() {
        super();
        this.visible = false;
        this._emoji = null;
        this._view = null;

    }

    onAdded() {
        this._emoji = new GameObject();
        this.add(this._emoji);

        this._happy = new Sprite('emoji_happy');
        this._happy.alignAnchor(0.5, 0.5);
        this._emoji.add(this._happy);
    }

    show() {
        this.visible = true;

        const emojiPulse = new Tween({
            scaleX: [1.2, 1], scaleY: [1.2, 1]
        }, 0.8, { loop: true, ease: Ease.sinusoidalOut });
        this._emoji.add(emojiPulse);
    }
}