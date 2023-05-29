import { GameObject, DisplayObject, Graphics, TextField, Sprite } from '../../../utils/black-engine.module';

export default class CoinsCounter extends DisplayObject {
    constructor() {
        super();
        this._scoreText = '20';
    }

    onAdded() {
        this._container = new GameObject();
        this.add(this._container);

        let outline = new Graphics();
        outline.beginPath();
        outline.roundedRect(0, 0, 200, 70, 30);
        outline.fillStyle(0x000000, 0.5);
        outline.fill(0);
        outline.stroke();


        this._container.addChild(outline);

        this._textField = new TextField(this._scoreText, 'lilita_one', 0xffffff, 40);
        this._textField.x = this._container.width / 10;
        this._textField.y = this._container.height / 7;
        this._container.addChild(this._textField);

        this._coinImage = new Sprite('coin');
        this._coinImage.alignAnchor(0.5, 0.5);
        this._coinImage.x = this._container.width / 1.5;
        this._coinImage.y = this._container.height / 2;
        this._container.addChild(this._coinImage);

    }

    scoreUpdate() {
        this._scoreText++;
        this._container.getChildAt(1).text = this._scoreText.toString();
        this._textField.scaleX = 1.5; this._textField.scaleY = 1.5;

        setTimeout(() => {
            this._textField.scaleX = 1; this._textField.scaleY = 1;
        }, 500);
    }
}
